import { Renderer } from "../renderer";
import { Mat4 } from "../../data/mat/mat4";
import { MathUtils } from "../../../utils/math_utils";
import { VanillaRenderPipeline } from "./vanilla_render_pipeline";
import { RenderResourcePool } from "./render_resource_pool";
import { Resolution } from "../../resolution";
import { Vec2 } from "../../data/vec/vec2";

export class VanillaRenderer extends Renderer {

    private _projectionMat!: Mat4;
    private _presentationFormat!: GPUTextureFormat;
    private _renderPipeline = new VanillaRenderPipeline();
    private _renderResourcePool = new RenderResourcePool();

    private _renderSettings = {
        near: 0.1,
        far: 20,
        resolution: new Resolution(new Vec2(1920, 1080)),
        fovY: 60
    };

    async initialize() {
        this._presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        this._renderResourcePool.resizeBuffers(this._renderSettings.resolution);
        this.buildProjectionMatrix();

        this._renderPipeline.buildPipeline();
        await this._renderPipeline.initialize({
            canvasPreferredTextureFormat: this._presentationFormat,
            viewProjBuffer: this._renderResourcePool.viewProjBuffer
        });
    }

    private buildProjectionMatrix() {
        this._projectionMat = Mat4.perspective(
            MathUtils.degToRad(this._renderSettings.fovY),
            this._renderSettings.resolution.aspectRatio,
            this._renderSettings.near, 
            this._renderSettings.far
        );
        
        // offset of 1 mat4 because the view matrix is also in there
        device.queue.writeBuffer(this._renderResourcePool.viewProjBuffer, Mat4.byteSize, this._projectionMat.asF32Array);
    }

    private assertCanvasResolution() {
        const width = Math.max(1, Math.min(device.limits.maxTextureDimension2D, gameCanvas.clientWidth));
        const height = Math.max(1, Math.min(device.limits.maxTextureDimension2D, gameCanvas.clientHeight));

        const resize = !this._renderResourcePool.hasTextures || width !== gameCanvas.width || height !== gameCanvas.height;
        if (!resize) return;

        gameCanvas.width = width;
        gameCanvas.height = height;
        this._renderSettings.resolution.full = new Vec2(width, height);

        this._renderResourcePool.resizeBuffers(this._renderSettings.resolution);
        this.buildProjectionMatrix();
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
        const commandEncoder = device.createCommandEncoder();
        this._renderResourcePool.prepareForFrame(scene, commandEncoder);
        this._renderPipeline.render(this._renderResourcePool);
        device.queue.submit([commandEncoder.finish()]);
    }

    free(): void {
        this._renderResourcePool.free();
    }

}