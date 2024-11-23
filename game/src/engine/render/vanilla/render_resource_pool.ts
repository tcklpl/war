import { BufferUtils } from '../../../utils/buffer_utils';
import { MathUtils } from '../../../utils/math_utils';
import { ShadowMapAtlas } from '../../data/atlas/shadow_map_atlas';
import { LuminanceHistogram } from '../../data/histogram/luminance_histogram';
import { Mat4 } from '../../data/mat/mat4';
import { Scene } from '../../data/scene/scene';
import { RenderHDRBufferChain } from '../../data/texture/render_hdr_buffer_chain';
import { Texture } from '../../data/texture/texture';
import { Vec2 } from '../../data/vec/vec2';
import { Vec3 } from '../../data/vec/vec3';
import { Resolution } from '../../resolution';
import { RenderPostEffects } from './render_post_effects';
import { RenderProjection } from './render_projection';

export class RenderResourcePool {
    private readonly _hdrTextureFormat: GPUTextureFormat = 'rgba16float';

    private _commandEncoder!: GPUCommandEncoder;
    private _scene!: Scene;
    private _projectionMatrix!: Mat4;
    private _inverseProjectionMatrix!: Mat4;
    private _renderProjection!: RenderProjection;
    private _renderPostEffects!: RenderPostEffects;
    private _jitter!: Vec2;

    private readonly _depthTexture = new Texture();
    private readonly _velocityTexture = new Texture();

    private readonly _hdrBufferChain!: RenderHDRBufferChain;

    private readonly _bloomMips = new Texture();
    private readonly _bloomMipsLength = 7;

    private readonly _normalTexture = new Texture();
    private readonly _ssaoTextureNoisy = new Texture();
    private readonly _ssaoTextureBlurred = new Texture();
    private readonly _specularTexture = new Texture();

    private _canvasTextureView!: GPUTextureView;
    private readonly _viewProjBuffer!: GPUBuffer;

    private _shadowMapAtlas!: ShadowMapAtlas;

    constructor() {
        // buffer has 5 mat4s and 1 vec3 (camera position)
        const viewProjByteSize = Mat4.byteSize * 5 + Vec3.byteSize + Vec2.byteSize;
        this._viewProjBuffer = BufferUtils.createEmptyBuffer(
            viewProjByteSize,
            GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            'Render Resource Pool: ViewProj Buffer',
        );

        // prefer rg11b10ufloat if the device supports it, as it uses 32 bits per pixel instead of 64 with rgba16float
        const canRenderToRG11B10 = device.features.has('rg11b10ufloat-renderable');
        if (canRenderToRG11B10) this._hdrTextureFormat = 'rg11b10ufloat';

        this._hdrBufferChain = new RenderHDRBufferChain(this._hdrTextureFormat);
    }

    async initialize() {
        /*
            Shadow map resolution will be 1x1 if shadows are off, otherwise:

            Very Low (1)    1024 x 1024 (2^10)
            Low (2)         2048 x 2048 (2^11)
            Medium (3)      4096 x 4096 (2^12)
            High (4)        8192 x 8192 (2^13)
        */
        const cfgShadowMapQuality = game.engine.config.graphics.shadowMapQuality;
        const clampedShadowMapQuality = MathUtils.clamp(1, 4, cfgShadowMapQuality);
        const shadowMapResolution = cfgShadowMapQuality === 0 ? 1 : 2 ** (9 + clampedShadowMapQuality);
        this._shadowMapAtlas = new ShadowMapAtlas(shadowMapResolution);
    }

    resizeBuffers(resolution: Resolution) {
        this.freeTextures();
        this.resizeCommonBuffers(resolution);
        this._hdrBufferChain.resize(resolution.full);
        this.resizeSSAOBuffers(resolution);
        this.resizeBloomBuffers(resolution);
    }

    private resizeCommonBuffers(resolution: Resolution) {
        this._depthTexture.texture = device.createTexture({
            label: 'render pool: depth texture',
            size: [resolution.full.x, resolution.full.y],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        });

        this._velocityTexture.texture = device.createTexture({
            label: 'render pool: velocity texture',
            size: [resolution.full.x, resolution.full.y],
            format: 'rg16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        });

        this._normalTexture.texture = device.createTexture({
            label: 'render pool: normal texture',
            size: [resolution.full.x, resolution.full.y],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        });

        this._specularTexture.texture = device.createTexture({
            label: 'render pool: specular texture',
            size: [resolution.full.x, resolution.full.y],
            format: 'rg16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        });
    }

    private resizeSSAOBuffers(resolution: Resolution) {
        const ssaoTextureSize = resolution.half;
        const useSSAO = game.engine.config.graphics.useSSAO;

        this._ssaoTextureNoisy.texture = useSSAO
            ? // if SSAO is enabled
              device.createTexture({
                  label: 'render pool: ssao noisy texture',
                  size: [ssaoTextureSize.x, ssaoTextureSize.y],
                  format: 'r16float',
                  usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
              })
            : // if SSAO is disabled
              device.createTexture({
                  label: 'render pool: ssao noisy texture',
                  size: [1, 1],
                  format: 'r16float',
                  usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
              });

        this._ssaoTextureBlurred.texture = useSSAO
            ? // if SSAO is enabled
              device.createTexture({
                  label: 'render pool: ssao blurred texture',
                  size: [ssaoTextureSize.x, ssaoTextureSize.y],
                  format: 'r16float',
                  usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
              })
            : // if SSAO is disabled
              device.createTexture({
                  label: 'render pool: ssao blurred texture',
                  size: [1, 1],
                  format: 'r16float',
                  usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
              });
    }

    private resizeBloomBuffers(resolution: Resolution) {
        this._bloomMips.texture = game.engine.config.graphics.useBloom
            ? // if bloom is enabled
              device.createTexture({
                  label: 'render pool: bloom mips',
                  size: [resolution.half.x, resolution.half.y],
                  format: this._hdrTextureFormat,
                  mipLevelCount: this._bloomMipsLength,
                  usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
              })
            : // if bloom is disabled
              device.createTexture({
                  label: 'render pool: bloom mips',
                  size: [1, 1],
                  format: this._hdrTextureFormat,
                  usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
              });
    }

    prepareForFrame(data: {
        scene: Scene;
        commandEncoder: GPUCommandEncoder;
        projection: RenderProjection;
        postEffets: RenderPostEffects;
        jitter: Vec2;
        luminanceHistogram: LuminanceHistogram;
    }) {
        this._scene = data.scene;
        this._commandEncoder = data.commandEncoder;
        this._canvasTextureView = gpuCtx.getCurrentTexture().createView();
        this._projectionMatrix = data.projection.projectionMatrix;
        this._inverseProjectionMatrix = data.projection.inverseProjectionMatrix;
        this._renderProjection = data.projection;
        this._renderPostEffects = data.postEffets;
        this._jitter = data.jitter;

        const camera = data.scene.activeCamera;
        if (!camera) return;

        // write camera view matrix, only need to do this once per loop as all shaders share the uniform buffer
        const frameSharedBuffer = Float32Array.of(
            ...camera.viewMatrix.asF32Array, // 0x000 - 0x040 - 64B - (1) Mat4 [ 4 * 4 * 4B = 64B ]
            ...camera.cameraMatrix.asF32Array, // 0x040 - 0x080 - 64B - (1) Mat4 [ 4 * 4 * 4B = 64B ]
            ...camera.previousFrameViewMatrix.asF32Array, // 0x080 - 0x0c0 - 64B - (1) Mat4 [ 4 * 4 * 4B = 64B ]
            ...this.projectionMatrix.asF32Array, // 0x0c0 - 0x100 - 64B - (1) Mat4 [ 4 * 4 * 4B = 64B ]
            ...this._renderProjection.previousFrameProjectionMatrix.asF32Array, // 0x100 - 0x140 - 64B - (1) Mat4 [ 4 * 4 * 4B = 64B ]
            ...camera.position.asF32Array, // 0x140 - 0x14c - 12B - (1) Vec3 [ 3 * 4B = 12B ]
            0, // 0x14c - 0x150 -  4B - Padding
            ...data.jitter.asF32Array, // 0x150 - 0x158 -  8B - (1) Vec2 [ 2 * 4B = 8B ]
        );
        device.queue.writeBuffer(this._viewProjBuffer, 0, frameSharedBuffer);

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
        this._shadowMapAtlas?.free();
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

    get shadowMapAtlas() {
        return this._shadowMapAtlas;
    }

    get jitter() {
        return this._jitter;
    }
}
