import { BufferUtils } from "../../../utils/buffer_utils";
import { Mat4 } from "../../data/mat/mat4";
import { Scene } from "../../data/scene/scene";
import { Vec3 } from "../../data/vec/vec3";
import { Resolution } from "../../resolution";

export class RenderResourcePool {

    private _commandEncoder!: GPUCommandEncoder;
    private _scene!: Scene;
    private _projectionMatrix!: Mat4;

    private _depthTexture!: GPUTexture;
    private _depthTextureView!: GPUTextureView;

    private _hdrTexture!: GPUTexture;
    private _hdrTextureView!: GPUTextureView;

    private _bloomMips!: GPUTexture;
    private _bloomMipsLength = 7;

    private _normalTexture!: GPUTexture;
    private _normalTextureView!: GPUTextureView;

    private _positionTexture!: GPUTexture;
    private _positionTextureView!: GPUTextureView;

    private _ssaoTextureNoisy!: GPUTexture;
    private _ssaoTextureViewNoisy!: GPUTextureView;

    private _ssaoTextureBlurred!: GPUTexture;
    private _ssaoTextureViewBlurred!: GPUTextureView;

    private _canvasTextureView!: GPUTextureView;
    private _viewProjBuffer!: GPUBuffer;

    constructor() {
        // buffer has 2 mat4 (view and projection) and 1 vec3 (camera position)
        const viewProjByteSize = Mat4.byteSize * 3 + Vec3.byteSize;
        this._viewProjBuffer = BufferUtils.createEmptyBuffer(viewProjByteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    }

    resizeBuffers(resolution: Resolution) {

        this._depthTexture?.destroy();
        this._hdrTexture?.destroy();
        this._bloomMips?.destroy();
        this._normalTexture?.destroy();
        this._ssaoTextureNoisy?.destroy();
        this._ssaoTextureBlurred?.destroy();
        this._positionTexture?.destroy();

        this._depthTexture = device.createTexture({
            size: [resolution.full.x, resolution.full.y],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this._depthTextureView = this._depthTexture.createView();

        this._hdrTexture = device.createTexture({
            size: [resolution.full.x, resolution.full.y],
            format: 'rgba16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this._hdrTextureView = this._hdrTexture.createView();

        this._bloomMips = device.createTexture({
            size: [resolution.half.x, resolution.half.y],
            format: 'rgba16float',
            mipLevelCount: this._bloomMipsLength,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

        this._normalTexture = device.createTexture({
            size: [resolution.full.x, resolution.full.y],
            format: 'rgba16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this._normalTextureView = this._normalTexture.createView();

        this._ssaoTextureNoisy = device.createTexture({
            label: 'render pool: ssao texture noisy',
            size: [resolution.full.x, resolution.full.y],
            format: 'r16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this._ssaoTextureViewNoisy = this._ssaoTextureNoisy.createView();

        this._ssaoTextureBlurred = device.createTexture({
            size: [resolution.full.x, resolution.full.y],
            format: 'r16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this._ssaoTextureViewBlurred = this._ssaoTextureBlurred.createView();

        this._positionTexture = device.createTexture({
            size: [resolution.full.x, resolution.full.y],
            format: 'rgba16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this._positionTextureView = this._positionTexture.createView();

    }

    prepareForFrame(scene: Scene, commandEncoder: GPUCommandEncoder, projectionMatrix: Mat4) {
        this._scene = scene;
        this._commandEncoder = commandEncoder;
        this._canvasTextureView = gpuCtx.getCurrentTexture().createView();
        this._projectionMatrix = projectionMatrix;

        const camera = scene.activeCamera;
        if (!camera) return;

        // write camera view matrix, only need to do this once per loop as all shaders share the uniform buffer
        device.queue.writeBuffer(this._viewProjBuffer, 0, camera.viewMatrix.asF32Array);
        device.queue.writeBuffer(this._viewProjBuffer, 1 * Mat4.byteSize, camera.cameraMatrix.asF32Array);
        device.queue.writeBuffer(this._viewProjBuffer, 3 * Mat4.byteSize, camera.position.asF32Array);
    }

    free() {
        this._depthTexture?.destroy();
        this._hdrTexture?.destroy();
        this._viewProjBuffer?.destroy();
        this._normalTexture?.destroy();
    }

    get hasTextures() {
        return !!this._hdrTexture && !!this._depthTexture;
    }

    get depthTextureView() {
        return this._depthTextureView;
    }

    get hdrTextureView() {
        return this._hdrTextureView;
    }

    get canvasTextureView() {
        return this._canvasTextureView;
    }

    get viewProjBuffer() {
        return this._viewProjBuffer;
    }

    get scene() {
        return this._scene;
    }
    
    get commandEncoder() {
        return this._commandEncoder;
    }

    get bloomMips() {
        return this._bloomMips;
    }

    get bloomMipsLength() {
        return this._bloomMipsLength;
    }

    get normalTexture() {
        return this._normalTexture;
    }

    get normalTextureView() {
        return this._normalTextureView;
    }

    get ssaoTextureNoisy() {
        return this._ssaoTextureNoisy;
    }

    get ssaoTextureViewNoisy() {
        return this._ssaoTextureViewNoisy;
    }

    get ssaoTextureBlurred() {
        return this._ssaoTextureBlurred;
    }

    get ssaoTextureViewBlurred() {
        return this._ssaoTextureViewBlurred;
    }

    get positionTexture() {
        return this._positionTexture;
    }

    get positionTextureView() {
        return this._positionTextureView;
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }

}