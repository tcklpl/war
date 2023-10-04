import { Renderer } from "../renderer";
import { VanillaRenderPipeline } from "./vanilla_render_pipeline";
import { RenderResourcePool } from "./render_resource_pool";
import { Vec2 } from "../../data/vec/vec2";
import { RenderProjection } from "./render_projection";
import { BufferUtils } from "../../../utils/buffer_utils";
import { MathUtils } from "../../../utils/math_utils";
import { RenderPostEffects } from "./render_post_effects";

export class VanillaRenderer extends Renderer {

    private _presentationFormat!: GPUTextureFormat;
    private _renderProjection = new RenderProjection();
    private _renderPostEffects = new RenderPostEffects();
    private _renderPipeline = new VanillaRenderPipeline();
    private _renderResourcePool = new RenderResourcePool();
    private _pickingBuffer = BufferUtils.createEmptyBuffer(4, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);

    // Jitter offsets - Needed for TAA, should be an array of zeroes if TAA is disabled
    private _jitterOffsetCount = 16;
    private _jitterOffsets: Vec2[] = [];
    private _currentJitter = 0;

    async initialize() {
        this._renderProjection.initialize();
        this._presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        await this._renderResourcePool.initialize();
        this._renderResourcePool.resizeBuffers(this._renderProjection.resolution);

        this._renderPipeline.buildPipeline(game.engine.config.graphics);
        await this._renderPipeline.initialize({
            canvasPreferredTextureFormat: this._presentationFormat,
            viewProjBuffer: this._renderResourcePool.viewProjBuffer,
            pickingBuffer: this._pickingBuffer,
            hdrTextureFormat: this._renderResourcePool.hdrTextureFormat,
            shadowMapAtlas: this._renderResourcePool.shadowMapAtlas
        });
        this.buildJitterOffsets(this._renderProjection.resolution.full);
    }

    /**
     * Jitter offsets used by TAA (Temporal Anti-Aliasing) to smooth pixelated edges.
     * Should be initialized to an array of zeroes if TAA is disabled.
     * 
     * @param resolution Screen resolution, needed to make sure all jitter offsets are less than 1px.
     */
    private buildJitterOffsets(resolution: Vec2) {

        let offsets: Vec2[] = [];

        if (game.engine.config.graphics.useTAA) {
            for (let i = 0; i < this._jitterOffsetCount; i++) {
                const offset = new Vec2(MathUtils.haltonSequence(2, i), MathUtils.haltonSequence(3, i));
                offset.x = ((offset.x - 0.5) / resolution.x) * 2;
                offset.y = ((offset.y - 0.5) / resolution.y) * 2;
                offsets.push(offset);
            }
        } else {
            offsets = Array(this._jitterOffsetCount).fill(Vec2.fromValue(0));
        }

        this._jitterOffsets = offsets;
    }

    private assertCanvasResolution() {
        const width = Math.max(1, Math.min(device.limits.maxTextureDimension2D, gameCanvas.clientWidth));
        const height = Math.max(1, Math.min(device.limits.maxTextureDimension2D, gameCanvas.clientHeight));

        const resize = !this._renderResourcePool.hasTextures || width !== gameCanvas.width || height !== gameCanvas.height;
        if (!resize) return;

        gameCanvas.width = width;
        gameCanvas.height = height;
        this._renderProjection.updateResolution(new Vec2(width, height));
        this._renderResourcePool.resizeBuffers(this._renderProjection.resolution);
        this.buildJitterOffsets(this._renderProjection.resolution.full);
    }

    private async updatePicking() {
        await this._pickingBuffer.mapAsync(GPUMapMode.READ, 0, 4);
        const idArray = new Uint32Array(this._pickingBuffer.getMappedRange(0, 4));
        const id = idArray[0];
        this._pickingBuffer.unmap();
        game.engine.managers.io.mouseInteractionManager.notifyFramePickingID(id);
    }
    
    async render() {
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

        this._currentJitter = (this._currentJitter + 1) % this._jitterOffsetCount;
        const frameJitter = this._jitterOffsets[this._currentJitter];

        this.assertCanvasResolution(); 
        const commandEncoder = device.createCommandEncoder();
        this._renderResourcePool.prepareForFrame(scene, commandEncoder, this._renderProjection, this._renderPostEffects, frameJitter);
        this._renderPipeline.render(this._renderResourcePool);
        device.queue.submit([commandEncoder.finish()]);

        await this.updatePicking();
        
    }

    free() {
        this._renderResourcePool.free();
        this._renderPipeline.free();
    }

}