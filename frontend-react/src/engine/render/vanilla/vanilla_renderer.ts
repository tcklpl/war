import { UniformBlockIndices } from "uniform-block-indices";
import { BufferUtils } from "../../../utils/buffer_utils";
import { Renderer } from "../renderer";
import { Mat4 } from "../../data/mat/mat4";
import { MathUtils } from "../../../utils/math_utils";
import { PBRShader } from "../../../shaders/pbr/pbr_shader";

export class VanillaRenderer extends Renderer {

    private sizeofMat4 = 4 * 4 * 4; // a (4 x 4) matrix with each element using 4 bytes

    private _projectionMat!: Mat4;
    private _viewProjBuffer!: GPUBuffer;
    private _viewProjBindGroup!: GPUBindGroup;

    private _presentationFormat!: GPUTextureFormat;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _renderTarget!: GPUTexture;
    private _renderTargetView!: GPUTextureView;
    private _depthTexture!: GPUTexture;
    private _depthTextureView!: GPUTextureView;

    private _pbrShader = new PBRShader('Main PBR Shader');
    private _pbrPipeline!: GPURenderPipeline;
    private _pbrViewProjectionBuffer!: GPUBuffer;

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
                buffers: <GPUVertexBufferLayout[]> [
                    // position
                    {
                        arrayStride: 3 * 4, // 3 floats, 4 bytes each
                        attributes: <GPUVertexAttribute[]> [
                            { shaderLocation: 0, offset: 0, format: 'float32x3' }
                        ]
                    },
                    // uv
                    {
                        arrayStride: 2 * 4, // 3 floats, 4 bytes each
                        attributes: <GPUVertexAttribute[]> [
                            { shaderLocation: 1, offset: 0, format: 'float32x2' }
                        ]
                    },
                    // normals
                    {
                        arrayStride: 3 * 4, // 3 floats, 4 bytes each
                        attributes: <GPUVertexAttribute[]> [
                            { shaderLocation: 2, offset: 0, format: 'float32x3' }
                        ]
                    },
                    // tangents
                    {
                        arrayStride: 4 * 4, // 3 floats, 4 bytes each
                        attributes: <GPUVertexAttribute[]> [
                            { shaderLocation: 3, offset: 0, format: 'float32x4' }
                        ]
                    }
                ]
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
                cullMode: 'back'
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
            colorAttachments: <GPURenderPassColorAttachment[]>[
                {
                    // view: undefined, Assigned later
                    // resolveTarget: undefined, Assigned Later
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    loadOp: 'clear',
                    storeOp: 'store'
                }
            ],
            depthStencilAttachment: {
                view: this._renderTargetView, // Assigned later
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'store'
            }
        }

        this._pbrViewProjectionBuffer = BufferUtils.createEmptyBuffer(Mat4.byteSize * 2, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST)
        this.buildProjectionMatrix();

        this._viewProjBindGroup = device.createBindGroup({
            layout: this._pbrPipeline.getBindGroupLayout(PBRShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: this._pbrViewProjectionBuffer }}
            ]
        });
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

        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass(this._renderPassDescriptor);
        passEncoder.setPipeline(this._pbrPipeline);
        passEncoder.setBindGroup(PBRShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ, this._viewProjBindGroup);

        game.engine.managers.scene.activeScene?.entitiesToRender.forEach(e => e.draw(passEncoder));

        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);
    }

    free(): void {
        gl.deleteBuffer(this._viewProjBuffer);
    }

    get pbrPipeline() {
        return this._pbrPipeline;
    }

}