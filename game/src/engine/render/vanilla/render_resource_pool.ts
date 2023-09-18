import { BufferOutOfBoundsError } from "../../../errors/engine/buffer_oob";
import { BufferUtils } from "../../../utils/buffer_utils";
import { Mat4 } from "../../data/mat/mat4";
import { Scene } from "../../data/scene/scene";
import { RenderHDRBufferChain } from "../../data/texture/render_hdr_buffer_chain";
import { Texture } from "../../data/texture/texture";
import { Vec2 } from "../../data/vec/vec2";
import { Vec3 } from "../../data/vec/vec3";
import { Resolution } from "../../resolution";
import { RenderPostEffects } from "./render_post_effects";
import { RenderProjection } from "./render_projection";

export class RenderResourcePool {

    private _hdrTextureFormat: GPUTextureFormat = 'rgba16float';

    private _commandEncoder!: GPUCommandEncoder;
    private _scene!: Scene;
    private _projectionMatrix!: Mat4;
    private _inverseProjectionMatrix!: Mat4;
    private _renderProjection!: RenderProjection;
    private _renderPostEffects!: RenderPostEffects;

    private _depthTexture = new Texture();
    private _velocityTexture = new Texture();

    private _hdrBufferChain!: RenderHDRBufferChain;

    private _bloomMips = new Texture();
    private _bloomMipsLength = 7;

    private _normalTexture = new Texture();
    private _ssaoTextureNoisy = new Texture();
    private _ssaoTextureBlurred = new Texture();
    private _specularTexture = new Texture();

    private _canvasTextureView!: GPUTextureView;
    private _viewProjBuffer!: GPUBuffer;

    constructor() {
        // buffer has 5 mat4s and 1 vec3 (camera position)
        const viewProjByteSize = Mat4.byteSize * 5 + Vec3.byteSize + Vec2.byteSize;
        this._viewProjBuffer = BufferUtils.createEmptyBuffer(viewProjByteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

        // prefer rg11b10ufloat if the device supports it, as it uses 32 bits per pixel instead of 64 with rgba16float
        const canRenderToRG11B10 = device.features.has("rg11b10ufloat-renderable");
        if (canRenderToRG11B10) this._hdrTextureFormat = 'rg11b10ufloat';

        this._hdrBufferChain = new RenderHDRBufferChain(this._hdrTextureFormat);
    }

    resizeBuffers(resolution: Resolution) {

        this.freeTextures();

        const ssaoTextureSize = resolution.half;

        this._depthTexture.texture = device.createTexture({
            label: 'render pool: depth texture',
            size: [resolution.full.x, resolution.full.y],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

        this._velocityTexture.texture = device.createTexture({
            label: 'render pool: velocity texture',
            size: [resolution.full.x, resolution.full.y],
            format: 'rg16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

        this._hdrBufferChain.resize(resolution.full);

        this._bloomMips.texture = device.createTexture({
            label: 'render pool: bloom mips',
            size: [resolution.half.x, resolution.half.y],
            format: this._hdrTextureFormat,
            mipLevelCount: this._bloomMipsLength,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

        this._normalTexture.texture = device.createTexture({
            label: 'render pool: normal texture',
            size: [resolution.full.x, resolution.full.y],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

        this._ssaoTextureNoisy.texture = device.createTexture({
            label: 'render pool: ssao noisy texture',
            size: [ssaoTextureSize.x, ssaoTextureSize.y],
            format: 'r16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

        this._ssaoTextureBlurred.texture = device.createTexture({
            label: 'render pool: ssao blurred texture',
            size: [ssaoTextureSize.x, ssaoTextureSize.y],
            format: 'r16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

        this._specularTexture.texture = device.createTexture({
            label: 'render pool: specular texture',
            size: [resolution.full.x, resolution.full.y],
            format: 'rg16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

    }

    prepareForFrame(scene: Scene, commandEncoder: GPUCommandEncoder, projection: RenderProjection, postEffets: RenderPostEffects, jitter: Vec2) {
        this._scene = scene;
        this._commandEncoder = commandEncoder;
        this._canvasTextureView = gpuCtx.getCurrentTexture().createView();
        this._projectionMatrix = projection.projectionMatrix;
        this._inverseProjectionMatrix = projection.inverseProjectionMatrix;
        this._renderProjection = projection;
        this._renderPostEffects = postEffets;

        const camera = scene.activeCamera;
        if (!camera) return;

        // write camera view matrix, only need to do this once per loop as all shaders share the uniform buffer
        device.queue.writeBuffer(this._viewProjBuffer, 0, camera.viewMatrix.asF32Array);
        device.queue.writeBuffer(this._viewProjBuffer, 1 * Mat4.byteSize, camera.cameraMatrix.asF32Array);
        device.queue.writeBuffer(this._viewProjBuffer, 2 * Mat4.byteSize, camera.previousFrameViewMatrix.asF32Array);
        device.queue.writeBuffer(this._viewProjBuffer, 3 * Mat4.byteSize, this.projectionMatrix.asF32Array);
        device.queue.writeBuffer(this._viewProjBuffer, 4 * Mat4.byteSize, this._renderProjection.previousFrameProjectionMatrix.asF32Array);
        device.queue.writeBuffer(this._viewProjBuffer, 5 * Mat4.byteSize, camera.position.asF32Array);
        device.queue.writeBuffer(this._viewProjBuffer, 5 * Mat4.byteSize + Vec3.byteSize + 4, jitter.asF32Array);

        // switch HDR textures (to also store the previous frame)
        this._hdrBufferChain.swapCurrentAndPrevious();
    }

    private freeTextures() {
        this._depthTexture.free();
        this._velocityTexture.free();
        this._hdrBufferChain.free();
        this._bloomMips.free();
        this._normalTexture.free();
        this._ssaoTextureNoisy.free();
        this._ssaoTextureBlurred.free();
        this._specularTexture.free();
    }

    free() {
        this.freeTextures();
        this._viewProjBuffer?.destroy();
    }

    get hasTextures() {
        return !!this._depthTexture;
    }

    get hdrTextureFormat() {
        return this._hdrTextureFormat;
    }

    get depthTextureView() {
        return this._depthTexture.view;
    }

    get velocityTextureView() {
        return this._velocityTexture.view;
    }

    get hdrBufferChain() {
        return this._hdrBufferChain;
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

    get renderProjection() {
        return this._renderProjection;
    }

    get renderPostEffects() {
        return this._renderPostEffects;
    }

    get resolution() {
        return this._renderProjection.resolution;
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
        return this._normalTexture.view;
    }

    get ssaoTextureNoisy() {
        return this._ssaoTextureNoisy;
    }

    get ssaoTextureViewNoisy() {
        return this._ssaoTextureNoisy.view;
    }

    get ssaoTextureBlurred() {
        return this._ssaoTextureBlurred;
    }

    get ssaoTextureViewBlurred() {
        return this._ssaoTextureBlurred.view;
    }

    get specularTexture() {
        return this._specularTexture;
    }

    get specularTextureView() {
        return this._specularTexture.view;
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }

    get inverseProjectionMatrix() {
        return this._inverseProjectionMatrix;
    }

}