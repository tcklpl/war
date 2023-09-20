import { AssetManager } from "./asset/asset_manager";
import { CameraManager } from "./data/camera/camera_manager";
import { LightManager } from "./data/lights/light_manager";
import { MaterialManager } from "./data/material/material_manager";
import { MeshManager } from "./data/meshes/mesh_manager";
import { SceneManager } from "./data/scene/scene_manager";
import { IFrameListener } from "./data/traits/frame_listener";
import { IDBWarConnection } from "./idb_war_connection";
import { IdentifierPool } from "./identifier_pool";
import { GameIO } from "./io/io";
import { BRDFLUTRenderer } from "./render/brdf_lut/brdf_lut_renderer";
import { CubemapConvolutionRenderer } from "./render/cubemap_convolution/cubemap_convolution_renderer";
import { CubemapPrefilterRenderer } from "./render/cubemap_prefilter/cubemap_prefilter_renderer";
import { EquirectangularToCubemapRenderer } from "./render/equirec_to_cubemap/equirec_to_cubemap_renderer";
import { Renderer } from "./render/renderer";
import { VanillaRenderer } from "./render/vanilla/vanilla_renderer";
import { Time } from "./time";

export class Engine {
    
    private _renderer: Renderer = new VanillaRenderer();
    private _shouldRender: boolean = false;

    private _idPool = new IdentifierPool();
    private _db = new IDBWarConnection();

    private _managers = {
        io: new GameIO(),
        asset: new AssetManager(),
        camera: new CameraManager(),
        mesh: new MeshManager(),
        scene: new SceneManager(),
        material: new MaterialManager(),
        light: new LightManager()
    };

    private _utilRenderers = {
        equirecToCubemap: new EquirectangularToCubemapRenderer(),
        cubemapConvolution: new CubemapConvolutionRenderer(),
        cubemapPrefilter: new CubemapPrefilterRenderer(),
        BRDF_LUT: new BRDFLUTRenderer()
    };

    private _frameListeners: IFrameListener[] = [];

    private _brdfLUT!: GPUTexture;

    // time
    private _lastFrameTime = 0;
    private _lastFullSecondTime = 0;
    private _framesRenderedSinceLastSecond = 0;

    constructor() {
        requestAnimationFrame(time => this.renderLoop(time));
    }

    private async renderLoop(time: number) {

        const msDiff = time - this._lastFrameTime;
        const deltaTime = msDiff / 1000;
        Time.DeltaTime = deltaTime;
        this._lastFrameTime = time;
        if (time - this._lastFullSecondTime >= 1000) {
            this._lastFullSecondTime = time;
            Time.FPS = this._framesRenderedSinceLastSecond;
            this._framesRenderedSinceLastSecond = 0;
            this._frameListeners.forEach(fl => {
                if (fl.onEachSecond) fl.onEachSecond();
            });
        }

        if (this._shouldRender) {
            this._frameListeners.forEach(fl => {
                if (fl.onEachFrame) fl.onEachFrame(deltaTime);
            });
            await this._renderer.render();
        }

        this._framesRenderedSinceLastSecond++;
        requestAnimationFrame(time => this.renderLoop(time));
    }

    pauseRender() {
        this._shouldRender = false;
    }

    async initialize() {
        await this.initializeDB();
        await this.initializeRenderers();
    }

    private async initializeDB() {
        await this._db.openConnection();
    }

    private async initializeRenderers() {
        await this.utilRenderers.equirecToCubemap.initialize();
        await this.utilRenderers.cubemapConvolution.initialize();
        await this.utilRenderers.cubemapPrefilter.initialize();
        await this.utilRenderers.BRDF_LUT.initialize();
        await this._renderer.initialize();

        this._brdfLUT = await this.utilRenderers.BRDF_LUT.renderLUT();
    }

    resumeRender() {
        this._shouldRender = true;
    }

    registerFrameListener(l: IFrameListener) {
        this._frameListeners.push(l);
    }

    free() {
        // prevent rendering while we destroy the whole engine
        this.pauseRender();

        this._db.closeConnection();

        // assets don't need any memory freeing
        // cameras also don't need any memory freeing
        this._managers.mesh.freeMeshes();
        // scenes also don't need any memory freeing
        this._managers.material.freeMaterials();
        this._managers.scene.freeScenes();

        this.utilRenderers.equirecToCubemap.free();
        this.utilRenderers.cubemapConvolution.free();
        this.utilRenderers.cubemapPrefilter.free();
        this.utilRenderers.BRDF_LUT.free();

        this._brdfLUT?.destroy();

        this._renderer.free();
    }

    get idPool() {
        return this._idPool;
    }

    get managers() {
        return this._managers;
    }

    get renderer() {
        return this._renderer;
    }

    get utilRenderers() {
        return this._utilRenderers;
    }

    get brdfLUT() {
        return this._brdfLUT;
    }

}