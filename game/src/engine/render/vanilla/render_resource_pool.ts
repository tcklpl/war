import { BufferUtils } from "../../../utils/buffer_utils";
import { Mat4 } from "../../data/mat/mat4";
import { Scene } from "../../data/scene/scene";
import { Vec3 } from "../../data/vec/vec3";
import { Resolution } from "../../resolution";

export class RenderResourcePool {

    private _commandEncoder!: GPUCommandEncoder;
    private _scene!: Scene;

    private _depthTexture!: GPUTexture;
    private _depthTextureView!: GPUTextureView;

    private _hdrTexture!: GPUTexture;
    private _hdrTextureView!: GPUTextureView;

    private _canvasTextureView!: GPUTextureView;

    private _viewProjBuffer!: GPUBuffer;

    constructor() {
        // buffer has 2 mat4 (view and projection) and 1 vec3 (camera position)
        const viewProjByteSize = Mat4.byteSize * 2 + Vec3.byteSize;
        this._viewProjBuffer = BufferUtils.createEmptyBuffer(viewProjByteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    }

    resizeBuffers(resolution: Resolution) {

        this._depthTexture?.destroy();
        this._hdrTexture?.destroy();

        this._depthTexture = device.createTexture({
            size: [resolution.full.x, resolution.full.y],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        this._depthTextureView = this._depthTexture.createView();

        this._hdrTexture = device.createTexture({
            size: [resolution.full.x, resolution.full.y],
            format: 'rgba16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this._hdrTextureView = this._hdrTexture.createView();

    }

    prepareForFrame(scene: Scene, commandEncoder: GPUCommandEncoder) {
        this._scene = scene;
        this._commandEncoder = commandEncoder;
        this._canvasTextureView = gpuCtx.getCurrentTexture().createView();

        const camera = scene.activeCamera;
        if (!camera) return;

        // write camera view matrix, only need to do this once per loop as all shaders share the uniform buffer
        device.queue.writeBuffer(this._viewProjBuffer, 0, camera.viewMatrix.asF32Array);
        device.queue.writeBuffer(this._viewProjBuffer, 2 * Mat4.byteSize, camera.position.asF32Array);
    }

    free() {
        this._depthTexture?.destroy();
        this._hdrTexture?.destroy();
        this._viewProjBuffer?.destroy();
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

}