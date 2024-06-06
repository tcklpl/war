import { AssetManager } from './asset/asset_manager';
import { ConfigManager } from './config/cfg_manager';
import { CameraManager } from './data/camera/camera_manager';
import { LightManager } from './data/lights/light_manager';
import { MaterialManager } from './data/material/material_manager';
import { MeshManager } from './data/meshes/mesh_manager';
import { SceneManager } from './data/scene/scene_manager';
import { IFrameListener } from './data/traits/frame_listener';
import { IDBWarConnection } from './idb_war_connection';
import { IdentifierPool } from './identifier_pool';
import { GameIO } from './io/io';
import { BRDFLUTRenderer } from './render/brdf_lut/brdf_lut_renderer';
import { CubemapPrefilterRenderer } from './render/cubemap_prefilter/cubemap_prefilter_renderer';
import { EquirectangularToCubemapRenderer } from './render/equirec_to_cubemap/equirec_to_cubemap_renderer';
import { MipmapRenderer } from './render/mipmap/mipmap_renderer';
import { Renderer } from './render/renderer';
import { TexturePackingRenderer } from './render/texture_packing/texture_packing_renderer';
import { VanillaRenderer } from './render/vanilla/vanilla_renderer';
import { Time } from './time';

export class Engine {
    private _renderer: Renderer = new VanillaRenderer();
    private _shouldRender: boolean = false;

    private _idPool = new IdentifierPool();
    private _db = new IDBWarConnection();
    private _config!: ConfigManager;

    private _managers = {
        io: new GameIO(),
        asset: new AssetManager(),
        camera: new CameraManager(),
        mesh: new MeshManager(),
        scene: new SceneManager(),
        material: new MaterialManager(),
        light: new LightManager(),
    };

    private _utilRenderers = {
        equirecToCubemap: new EquirectangularToCubemapRenderer(),
        cubemapPrefilter: new CubemapPrefilterRenderer(),
        BRDF_LUT: new BRDFLUTRenderer(),
        mipmap: new MipmapRenderer(),
        packing: new TexturePackingRenderer(),
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
        this._config = new ConfigManager(this._db);
        await this._config.loadConfig();
        await this._config.saveConfig();
        await this._managers.asset.initializeDB(this._db);
    }

    private async initializeRenderers() {
        await this.utilRenderers.equirecToCubemap.initialize();
        await this.utilRenderers.cubemapPrefilter.initialize();
        await this.utilRenderers.BRDF_LUT.initialize();
        await this.utilRenderers.mipmap.initialize();
        await this.utilRenderers.packing.initialize();
        await this._renderer.initialize();

        this._brdfLUT = await this.utilRenderers.BRDF_LUT.renderLUT();
    }

    resumeRender() {
        this._shouldRender = true;
    }

    registerFrameListener(l: IFrameListener) {
        this._frameListeners.push(l);
    }

    async free() {
        // prevent rendering while we destroy the whole engine
        this.pauseRender();

        // assets don't need any memory freeing
        // cameras also don't need any memory freeing
        this._managers.mesh.freeMeshes();
        // scenes also don't need any memory freeing
        this._managers.material.freeMaterials();
        this._managers.scene.freeScenes();

        this.utilRenderers.equirecToCubemap.free();
        this.utilRenderers.cubemapPrefilter.free();
        this.utilRenderers.BRDF_LUT.free();
        this.utilRenderers.mipmap.free();
        this.utilRenderers.packing.free();

        this._brdfLUT?.destroy();

        this._renderer.free();
    }

    async reinitializeRenderer() {
        const wasRendering = this._shouldRender;
        this.pauseRender();

        await this._renderer.free();
        this._renderer = new VanillaRenderer();
        await this._renderer.initialize();

        if (wasRendering) this.resumeRender();
    }

    get idPool() {
        return this._idPool;
    }

    get managers() {
        return this._managers;
    }

    get db() {
        return this._db;
    }

    get config() {
        return this._config;
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
