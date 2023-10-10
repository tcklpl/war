import { DepthShader } from "../../../../shaders/geometry/depth/depth_shader";
import { BufferUtils } from "../../../../utils/buffer_utils";
import { MathUtils } from "../../../../utils/math_utils";
import { MatrixUtils } from "../../../../utils/matrix_utils";
import { Camera } from "../../../data/camera/camera";
import { DirectionalLight } from "../../../data/lights/directional_light";
import { Mat4 } from "../../../data/mat/mat4";
import { PrimitiveDrawOptions } from "../../../data/meshes/primitive_draw_options";
import { Vec3 } from "../../../data/vec/vec3";
import { Vec4 } from "../../../data/vec/vec4";
import { RenderInitializationResources } from "../render_initialization_resources";
import { RenderProjection } from "../render_projection";
import { RenderResourcePool } from "../render_resource_pool";
import { RenderStage } from "./render_stage";

export class RenderStageLights implements RenderStage {

    private _zMult = 1;

    private _depthShader!: DepthShader;
    private _depthPipeline!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _primitiveDrawOptions = new PrimitiveDrawOptions().includePosition(0);
    private _viewProjBindGroup!: GPUBindGroup;

    private _shadowCommonBuffer = BufferUtils.createEmptyBuffer(Mat4.byteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, 'shadow map common buffer');

    async initialize(resources: RenderInitializationResources) {
        
        await new Promise<void>(r => {
            this._depthShader = new DepthShader('depth shader', () => r());
        });

        this._depthPipeline = await this.createPipeline();
        this._renderPassDescriptor = this.createRenderPassDescriptor();
        this._viewProjBindGroup = this.createViewProjBindGroup(this._shadowCommonBuffer);
    }

    private createPipeline() {
        return device.createRenderPipelineAsync({
            label: `rs ssao pipeline`,
            layout: 'auto',
            vertex: {
                module: this._depthShader.module,
                entryPoint: 'vertex',
                buffers: [
                    // position
                    {
                        arrayStride: 3 * 4,
                        attributes: [
                            { shaderLocation: 0, offset: 0, format: 'float32x3' }
                        ]
                    }
                ] as GPUVertexBufferLayout[]
            },
            fragment: {
                module: this._depthShader.module,
                entryPoint: 'fragment',
                targets: []
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none'
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus'
            }
        })
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [],
            depthStencilAttachment: {
                // view will be assigned later
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'store'
            } as GPURenderPassDepthStencilAttachment
        } as GPURenderPassDescriptor;
    }

    private createViewProjBindGroup(buffer: GPUBuffer) {
        return device.createBindGroup({
            label: 'PBR ViewProj',
            layout: this._depthPipeline.getBindGroupLayout(DepthShader.BINDING_GROUPS.VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: buffer }}
            ]
        });
    }

    private setDepthTexture(depthView: GPUTextureView) {
        (this._renderPassDescriptor.depthStencilAttachment as GPURenderPassDepthStencilAttachment).view = depthView;
    }

    private getDirectionalLightViewProjMatrix(light: DirectionalLight, camera: Camera, renderProjection: RenderProjection) {
        // light projection matrix, used to get frustum corners
        const proj = Mat4.perspective(
            Math.PI - 0.5 * MathUtils.degToRad(renderProjection.fovY), 
            renderProjection.resolution.aspectRatio,
            0.9, // renderProjection.near,
            30 //renderProjection.far
        );

        const frustumCorners = MatrixUtils.getFrustumCornersWorldSpace(proj, camera.viewMatrix);
        const frustumCenter = Vec4.centroid(frustumCorners);

        // create a light view matrix from the light's direction and the view frustum center
        const lightDir = light.rotation.asDirectionVector.clone().normalize();
        const lightView = Mat4.lookAt(
            Vec3.add(frustumCenter.xyz, lightDir),
            frustumCenter.xyz,
            new Vec3(0, 1, 0)
        );
        
        // get the min and max of the view frustum coordinates in light space to make the projection matrix
        const minCorner = Vec3.fromValue(Infinity);
        const maxCorner = Vec3.fromValue(-Infinity);

        for (const corner of frustumCorners) {
            const trf = lightView.multiplyByVec4(corner);

            minCorner.x = Math.min(minCorner.x, trf.x);
            minCorner.y = Math.min(minCorner.y, trf.y);
            minCorner.z = Math.min(minCorner.z, trf.z);

            maxCorner.x = Math.max(maxCorner.x, trf.x);
            maxCorner.y = Math.max(maxCorner.y, trf.y);
            maxCorner.z = Math.max(maxCorner.z, trf.z);
        }

        // multiply the Z to also include geometry behind the camera
        if (minCorner.z < 0) {
            minCorner.z *= this._zMult;
        } else {
            minCorner.z /= this._zMult;
        }

        if (maxCorner.z < 0) {
            maxCorner.z /= this._zMult;
        } else {
            maxCorner.z *= this._zMult;
        }

        // finally create the light's projection matrix
        const lightProjection = Mat4.ortho(minCorner.x, maxCorner.x, minCorner.y, maxCorner.y, minCorner.z, maxCorner.z);
        const lightViewProj = lightProjection.duplicate().multiplyByMat4(lightView);
        return lightViewProj;
    }

    render(pool: RenderResourcePool) {

        pool.commandEncoder.pushDebugGroup('Light Renderer');

        // update light buffers
        pool.scene.info.updateLightBuffers();

        // get corners and center of the view frustum
        const camera = pool.scene.activeCamera as Camera;
        
        this.setDepthTexture(pool.shadowMapAtlas.texture.view);
        const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);
        rpe.setPipeline(this._depthPipeline);
        rpe.setBindGroup(DepthShader.BINDING_GROUPS.VIEWPROJ, this._viewProjBindGroup);

        // render shadow maps
        for (const light of pool.scene.lights) {
            
            // make sure all shadow-casting lights have their spot on the shadow map
            if (light.properties.castsShadows && !light.shadowAtlasMappedRegion) {
                // try to get a region on the shadow map for the light
                light.shadowAtlasMappedRegion = pool.shadowMapAtlas.requestMappedRegion({
                    preferredSize: light.properties.shadowMapSize,
                    canShrink: light.properties.shadowMapCanShrink
                }) ?? undefined;
            }

            // this time we only check "shadowAtlasMappedRegion" because "castsShadows" doesn't necessarily mean that
            // the light has a spot on the shadow map.
            if (light.shadowAtlasMappedRegion) {

                // set the pipeline viewport as the reserved region on the shadow atlas
                rpe.setViewport(
                    light.shadowAtlasMappedRegion.lowerCorner.x, light.shadowAtlasMappedRegion.lowerCorner.y,
                    light.shadowAtlasMappedRegion.size.x, light.shadowAtlasMappedRegion.size.y,
                    0, 1
                );

                // for now, only directional lights are going to cast shadows
                if (light instanceof DirectionalLight) {
                    
                    const lightViewProj = this.getDirectionalLightViewProjMatrix(light, camera, pool.renderProjection);
                    light.shadowMappingViewProj = lightViewProj;
                    device.queue.writeBuffer(this._shadowCommonBuffer, 0, lightViewProj.asF32Array);
                    pool.scene.entitiesToRender.forEach(e => e.draw(rpe, this._depthPipeline, this._primitiveDrawOptions));
                }
            }
        }

        rpe.end();

        pool.commandEncoder.popDebugGroup();
    }

    free() {
        this._shadowCommonBuffer.destroy();
    }

}
