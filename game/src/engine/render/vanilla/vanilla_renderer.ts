import { BufferUtils } from "../../../utils/buffer_utils";
import { Renderer } from "../renderer";
import { Mat4 } from "../../data/mat/mat4";
import { MathUtils } from "../../../utils/math_utils";
import { Vec3 } from "../../data/vec/vec3";
import { VanillaRenderPipeline } from "./vanilla_render_pipeline";
import { RenderResourcePool } from "./render_resource_pool";

export class VanillaRenderer extends Renderer {

    private _projectionMat!: Mat4;
    private _pbrViewProjectionBuffer!: GPUBuffer;

    private _presentationFormat!: GPUTextureFormat;
    private _hdrRenderTarget!: GPUTexture;
    private _depthTexture!: GPUTexture;

    private _renderPipeline = new VanillaRenderPipeline();
    private _renderResourcePool = new RenderResourcePool();

    private _renderSettings = {
        near: 0.1,
        far: 20,
        width: 1920,
        height: 1080,
        fovY: 60
    };

    async initialize() {
        this._presentationFormat = navigator.gpu.getPreferredCanvasFormat();

        // buffer has 2 mat4 (view and projection) and 1 vec3 (camera position)
        const viewProjByteSize = Mat4.byteSize * 2 + Vec3.byteSize;
        this._pbrViewProjectionBuffer = BufferUtils.createEmptyBuffer(viewProjByteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST)
        this.buildProjectionMatrix();

        this._renderPipeline.buildPipeline();
        await this._renderPipeline.initialize({
            canvasPreferredTextureFormat: this._presentationFormat,
            viewProjBuffer: this._pbrViewProjectionBuffer,
            depthBufferTexture: this._depthTexture,
            hdrBufferTexture: this._hdrRenderTarget
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

        const resize = !this._hdrRenderTarget || width !== gameCanvas.width || height !== gameCanvas.height;
        if (!resize) return;

        if (this._hdrRenderTarget) this._hdrRenderTarget.destroy();
        if (this._depthTexture) this._depthTexture.destroy();

        gameCanvas.width = width;
        gameCanvas.height = height;
        this._renderSettings.width = width;
        this._renderSettings.height = height;

        const renderTarget = device.createTexture({
            size: [width, height],
            format: 'rgba16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this._hdrRenderTarget = renderTarget;

        const depthTexture = device.createTexture({
            size: [width, height],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        this._depthTexture = depthTexture;

        this.buildProjectionMatrix();
        this._renderPipeline.dispatchResizeCallback({
            canvasPreferredTextureFormat: this._presentationFormat,
            viewProjBuffer: this._pbrViewProjectionBuffer,
            depthBufferTexture: this._depthTexture,
            hdrBufferTexture: this._hdrRenderTarget
        });
    }
    
    render(): void {
        const scene = game.engine.managers.scene.activeScene;
        if (!scene) {
            console.warn('Trying to render with no active scene');
            return;
        }
        const camera = scene.activeCamera;
        if (!camera) {
            console.warn('Trying to render with no active camera');
            return;
        }

        this.assertCanvasResolution(); 

        // write camera view matrix, only need to do this once per loop as all shaders share the uniform buffer
        device.queue.writeBuffer(this._pbrViewProjectionBuffer, 0, camera.viewMatrix.asF32Array);
        device.queue.writeBuffer(this._pbrViewProjectionBuffer, 2 * Mat4.byteSize, camera.position.asF32Array);

        const commandEncoder = device.createCommandEncoder();

        this._renderResourcePool.scene = scene;
        this._renderResourcePool.viewProjBuffer = this._pbrViewProjectionBuffer;
        this._renderResourcePool.canvasTextureView = gpuCtx.getCurrentTexture().createView();
        this._renderResourcePool.depthTextureView = this._depthTexture.createView();
        this._renderResourcePool.hdrTextureView = this._hdrRenderTarget.createView();
        this._renderResourcePool.commandEncoder = commandEncoder;

        this._renderPipeline.render(this._renderResourcePool);

        device.queue.submit([commandEncoder.finish()]);
    }

    free(): void {
        this._hdrRenderTarget?.destroy();
        this._depthTexture?.destroy();
        this._pbrViewProjectionBuffer?.destroy();
    }

}