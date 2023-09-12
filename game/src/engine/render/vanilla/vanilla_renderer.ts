import { Renderer } from "../renderer";
import { VanillaRenderPipeline } from "./vanilla_render_pipeline";
import { RenderResourcePool } from "./render_resource_pool";
import { Vec2 } from "../../data/vec/vec2";
import { RenderProjection } from "./render_projection";
import { BufferUtils } from "../../../utils/buffer_utils";

export class VanillaRenderer extends Renderer {

    private _presentationFormat!: GPUTextureFormat;
    private _renderProjection = new RenderProjection();
    private _renderPipeline = new VanillaRenderPipeline();
    private _renderResourcePool = new RenderResourcePool();
    private _pickingBuffer = BufferUtils.createEmptyBuffer(4, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);

    async initialize() {
        this._presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        this._renderResourcePool.resizeBuffers(this._renderProjection.resolution);

        this._renderPipeline.buildPipeline();
        await this._renderPipeline.initialize({
            canvasPreferredTextureFormat: this._presentationFormat,
            viewProjBuffer: this._renderResourcePool.viewProjBuffer,
            pickingBuffer: this._pickingBuffer,
            hdrTextureFormat: this._renderResourcePool.hdrTextureFormat
        });
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

        this.assertCanvasResolution(); 
        const commandEncoder = device.createCommandEncoder();
        this._renderResourcePool.prepareForFrame(scene, commandEncoder, this._renderProjection);
        this._renderPipeline.render(this._renderResourcePool);
        device.queue.submit([commandEncoder.finish()]);

        await this.updatePicking();
        
    }

    free() {
        this._renderResourcePool.free();
        this._renderPipeline.free();
    }

}