import { PrincipledBSDFShader } from '../../../../shaders/geometry/principled_bsdf/principled_bsdf_shader';
import { PrimitiveDrawOptions } from '../../../data/meshes/primitive_draw_options';
import { SceneInfoBindGroupOptions } from '../../../data/scene/scene_info_bind_group_options';
import { RenderInitializationResources } from '../render_initialization_resources';
import { RenderResourcePool } from '../render_resource_pool';
import { RenderStage } from './render_stage';

export class RenderStageSolidGeometry implements RenderStage {
    private _principledShader!: PrincipledBSDFShader;
    private _pipelineCW!: GPURenderPipeline;
    private _pipelineCCW!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _viewProjBindGroupCW!: GPUBindGroup;
    private _viewProjBindGroupCCW!: GPUBindGroup;
    private readonly _meshDrawOptions = new PrimitiveDrawOptions().includeAll();
    private _sceneBindGroupOptions!: SceneInfoBindGroupOptions;

    private readonly _shadowMapSampler = device.createSampler({
        addressModeU: 'repeat',
        addressModeV: 'repeat',
    });

    async initialize(resources: RenderInitializationResources) {
        await new Promise<void>(r => {
            this._principledShader = new PrincipledBSDFShader('rs principled bsdf', () => r());
        });

        this._sceneBindGroupOptions = new SceneInfoBindGroupOptions(PrincipledBSDFShader.BINDING_GROUPS.SCENE_INFO)
            .includeDirectionalLights(2)
            .includePointLights(3)
            .includeExtras([
                { binding: 0, resource: this._shadowMapSampler },
                { binding: 1, resource: resources.shadowMapAtlas.texture.view },
            ]);

        this._pipelineCW = await this.createPipeline('cw', resources.hdrTextureFormat);
        this._pipelineCCW = await this.createPipeline('ccw', resources.hdrTextureFormat);
        this._renderPassDescriptor = this.createRenderPassDescriptor();
        this._viewProjBindGroupCW = this.createViewProjBindGroup('cw', resources.viewProjBuffer);
        this._viewProjBindGroupCCW = this.createViewProjBindGroup('ccw', resources.viewProjBuffer);
    }

    private createPipeline(windingOrder: 'cw' | 'ccw', hdrTextureFormat: GPUTextureFormat) {
        return device.createRenderPipelineAsync({
            label: `rs solid geometry pipeline`,
            layout: 'auto',
            vertex: {
                module: this._principledShader.module,
                entryPoint: 'vertex',
                buffers: [
                    // position
                    {
                        arrayStride: 3 * 4,
                        attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
                    },
                    // uv
                    {
                        arrayStride: 2 * 4,
                        attributes: [{ shaderLocation: 1, offset: 0, format: 'float32x2' }],
                    },
                    // normals
                    {
                        arrayStride: 3 * 4,
                        attributes: [{ shaderLocation: 2, offset: 0, format: 'float32x3' }],
                    },
                    // tangents
                    {
                        arrayStride: 4 * 4,
                        attributes: [{ shaderLocation: 3, offset: 0, format: 'float32x4' }],
                    },
                ] as GPUVertexBufferLayout[],
            },
            fragment: {
                module: this._principledShader.module,
                entryPoint: 'fragment',
                targets: [
                    { format: hdrTextureFormat }, // hdr buffer
                    { format: 'rgba8unorm' as GPUTextureFormat }, // view-space normal buffer
                    { format: 'rg16float' as GPUTextureFormat }, // specular and roughness
                ],
                constants: {
                    shader_quality: game.engine.config.graphics.shaderQuality,
                },
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
                frontFace: windingOrder,
            },
            depthStencil: {
                depthWriteEnabled: false,
                depthCompare: 'equal',
                format: 'depth24plus',
            },
        });
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [
                // HDR Output
                {
                    // view: undefined, Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
                // Normal Buffer Output
                {
                    // view: undefined, Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
                // Specular Buffer Output
                {
                    // view: undefined, Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ] as GPURenderPassColorAttachment[],
            depthStencilAttachment: {
                // view: undefined, Assigned later
                depthReadOnly: true,
            } as GPURenderPassDepthStencilAttachment,
        } as GPURenderPassDescriptor;
    }

    private createViewProjBindGroup(windingOrder: 'cw' | 'ccw', buffer: GPUBuffer) {
        const pipeline = windingOrder === 'ccw' ? this._pipelineCCW : this._pipelineCW;
        return device.createBindGroup({
            label: 'PBR ViewProj',
            layout: pipeline.getBindGroupLayout(PrincipledBSDFShader.BINDING_GROUPS.VIEWPROJ),
            entries: [{ binding: 0, resource: { buffer: buffer } }],
        });
    }

    private setDepthTexture(depthTex: GPUTextureView) {
        (this._renderPassDescriptor.depthStencilAttachment as GPURenderPassDepthStencilAttachment).view = depthTex;
    }

    private setColorAttachment(index: number, view: GPUTextureView) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[index].view = view;
    }

    render(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('Solid Geometry Renderer');
        this.setDepthTexture(pool.depthTextureView);
        this.setColorAttachment(0, pool.hdrBufferChain.current.view);
        this.setColorAttachment(1, pool.normalTextureView);
        this.setColorAttachment(2, pool.specularTextureView);
        const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);

        if (pool.scene.entitiesPerWindingOrder.ccw.length > 0) {
            rpe.setPipeline(this._pipelineCCW);
            rpe.setBindGroup(PrincipledBSDFShader.BINDING_GROUPS.VIEWPROJ, this._viewProjBindGroupCCW);
            const sceneInfoBindGroup = pool.scene.info.getBindGroup(this._pipelineCCW, this._sceneBindGroupOptions);
            rpe.setBindGroup(PrincipledBSDFShader.BINDING_GROUPS.SCENE_INFO, sceneInfoBindGroup);
            pool.scene.entitiesPerWindingOrder.ccw.forEach(e => e.draw(rpe, this._pipelineCCW, this._meshDrawOptions));
        }

        if (pool.scene.entitiesPerWindingOrder.cw.length > 0) {
            rpe.setPipeline(this._pipelineCW);
            rpe.setBindGroup(PrincipledBSDFShader.BINDING_GROUPS.VIEWPROJ, this._viewProjBindGroupCW);
            const sceneInfoBindGroup = pool.scene.info.getBindGroup(this._pipelineCW, this._sceneBindGroupOptions);
            rpe.setBindGroup(PrincipledBSDFShader.BINDING_GROUPS.SCENE_INFO, sceneInfoBindGroup);
            pool.scene.entitiesPerWindingOrder.cw.forEach(e => e.draw(rpe, this._pipelineCW, this._meshDrawOptions));
        }

        rpe.end();
        pool.commandEncoder.popDebugGroup();
    }
}
