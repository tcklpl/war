import { BufferUtils } from "../../../utils/buffer_utils";
import { Renderer } from "../renderer";
import { Mat4 } from "../../data/mat/mat4";
import { MathUtils } from "../../../utils/math_utils";
import { PBRShader } from "../../../shaders/pbr/pbr_shader";
import { Vec3 } from "../../data/vec/vec3";

export class VanillaRenderer extends Renderer {


    private _projectionMat!: Mat4;
    private _viewProjBindGroup!: GPUBindGroup;
    private _pbrViewProjectionBuffer!: GPUBuffer;

    private _presentationFormat!: GPUTextureFormat;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _renderTarget!: GPUTexture;
    private _renderTargetView!: GPUTextureView;
    private _depthTexture!: GPUTexture;
    private _depthTextureView!: GPUTextureView;

    private _pbrShader = new PBRShader('Main PBR Shader', () => this.initialize());
    private _pbrPipeline!: GPURenderPipeline;

    private _renderSettings = {
        near: 0.1,
        far: 100,
        width: 1920,
        height: 1080,
        fovY: 60
    };

    initialize(): void {
        this._presentationFormat = navigator.gpu.getPreferredCanvasFormat();

        this._pbrPipeline = device.createRenderPipeline({
            label: 'pbr',
            layout: 'auto',
            vertex: {
                module: this._pbrShader.module,
                entryPoint: 'vertex',
                buffers: [
                    // position
                    {
                        arrayStride: 3 * 4, // 3 floats, 4 bytes each
                        attributes: [
                            { shaderLocation: 0, offset: 0, format: 'float32x3' }
                        ]
                    },
                    // uv
                    {
                        arrayStride: 2 * 4, // 3 floats, 4 bytes each
                        attributes: [
                            { shaderLocation: 1, offset: 0, format: 'float32x2' }
                        ]
                    },
                    // normals
                    {
                        arrayStride: 3 * 4, // 3 floats, 4 bytes each
                        attributes: [
                            { shaderLocation: 2, offset: 0, format: 'float32x3' }
                        ]
                    },
                    // tangents
                    {
                        arrayStride: 4 * 4, // 3 floats, 4 bytes each
                        attributes: [
                            { shaderLocation: 3, offset: 0, format: 'float32x4' }
                        ]
                    }
                ] as GPUVertexBufferLayout[]
            },
            fragment: {
                module: this._pbrShader.module,
                entryPoint: 'fragment',
                targets: [
                    { format: this._presentationFormat }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                /*
                    I concluded that cullMode as none will be a favorable trade-off since otherwise I would need to create 2 PBR pipelines:
                    one for each winding (CW and CCW) as gltf specifies that:
                    
                    "the determinant of the node’s global transform defines the winding order of that primitive. 
                    If the determinant is a positive value, the winding order triangle faces is counterclockwise; 
                    in the opposite case, the winding order is clockwise."

                    As the game will not have that many objects AND this pipeline will not make a lot of calculation (as we'll be rendering to a gBuffer),
                    I decided to remove the GPU culling. If mirrored geometry becomes a necessity in the future I'll edit this, in that case I would need
                    to check each primitives winding order and separate them into 2 groups and render with 2 pipelines (don't switch pipelines per object).
                */
                cullMode: 'none'
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus'
            },
            multisample: {
                count: 4
            }
        });

        this._renderPassDescriptor = {
            colorAttachments: [
                {
                    // view: undefined, Assigned later
                    // resolveTarget: undefined, Assigned Later
                    clearValue: { r: 0.3, g: 0.3, b: 0.3, a: 1 },
                    loadOp: 'clear',
                    storeOp: 'store'
                }
            ] as GPURenderPassColorAttachment[],
            depthStencilAttachment: {
                view: this._renderTargetView, // Assigned later
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'store'
            }
        }

        // buffer has 2 mat4 (view and projection) and 1 vec3 (camera position)
        const viewProjByteSize = Mat4.byteSize * 2 + Vec3.byteSize;
        this._pbrViewProjectionBuffer = BufferUtils.createEmptyBuffer(viewProjByteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST)
        this.buildProjectionMatrix();

        this._viewProjBindGroup = device.createBindGroup({
            label: 'PBR ViewProj',
            layout: this._pbrPipeline.getBindGroupLayout(PBRShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: this._pbrViewProjectionBuffer }}
            ]
        });

        game.engine.managers.light.constructBuffers();
    }

    private buildProjectionMatrix() {
        this._projectionMat = Mat4.perspective(
            MathUtils.degToRad(this._renderSettings.fovY),
            this._renderSettings.width / this._renderSettings.height,
            this._renderSettings.near, 
            this._renderSettings.far
        );
        
        // offset of 1 mat4 because the view matrix is also in there
        device.queue.writeBuffer(this._pbrViewProjectionBuffer, Mat4.byteSize, this._projectionMat.asF32Array);
    }

    private assertCanvasResolution() {
        const width = Math.max(1, Math.min(device.limits.maxTextureDimension2D, gameCanvas.clientWidth));
        const height = Math.max(1, Math.min(device.limits.maxTextureDimension2D, gameCanvas.clientHeight));

        const resize = !this._renderTarget || width !== gameCanvas.width || height !== gameCanvas.height;
        if (!resize) return;

        if (this._renderTarget) this._renderTarget.destroy();
        if (this._depthTexture) this._depthTexture.destroy();

        gameCanvas.width = width;
        gameCanvas.height = height;
        this._renderSettings.width = width;
        this._renderSettings.height = height;

        const renderTarget = device.createTexture({
            size: [width, height],
            format: this._presentationFormat,
            sampleCount: 4,
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        this._renderTarget = renderTarget;
        this._renderTargetView = renderTarget.createView();

        const depthTexture = device.createTexture({
            size: [width, height],
            format: 'depth24plus',
            sampleCount: 4,
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        this._depthTexture = depthTexture;
        this._depthTextureView = depthTexture.createView();

        (this._renderPassDescriptor.depthStencilAttachment as GPURenderPassDepthStencilAttachment).view = this._depthTextureView;

        this.buildProjectionMatrix();
        game.engine.managers.light.writeBuffer();
    }
    
    render(): void {
        const camera = game.engine.managers.scene.activeScene?.activeCamera;
        if (!camera) {
            console.warn('Trying to render with no active camera');
            return;
        }

        this.assertCanvasResolution(); 

        // write camera view matrix, only need to do this once per loop as all shaders share the uniform buffer
        device.queue.writeBuffer(this._pbrViewProjectionBuffer, 0, camera.viewMatrix.asF32Array);
        device.queue.writeBuffer(this._pbrViewProjectionBuffer, 2 * Mat4.byteSize, camera.position.asF32Array);

        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = this._renderTargetView;
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].resolveTarget = gpuCtx.getCurrentTexture().createView();
        (this._renderPassDescriptor.depthStencilAttachment as GPURenderPassDepthStencilAttachment).view = this._depthTextureView;

        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass(this._renderPassDescriptor);
        passEncoder.setPipeline(this._pbrPipeline);
        passEncoder.setBindGroup(PBRShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ, this._viewProjBindGroup);

        game.engine.managers.light.bindLights(passEncoder);
        game.engine.managers.scene.activeScene?.entitiesToRender.forEach(e => e.draw(passEncoder));

        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);
    }

    free(): void {
        this._renderTarget?.destroy();
        this._depthTexture?.destroy();
        this._pbrViewProjectionBuffer?.destroy();
    }

    get pbrPipeline() {
        return this._pbrPipeline;
    }

}