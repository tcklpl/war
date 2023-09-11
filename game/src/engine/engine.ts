import { AssetManager } from "./asset/AssetManager";
import { CameraManager } from "./data/camera/camera_manager";
import { LightManager } from "./data/lights/light_manager";
import { MaterialManager } from "./data/material/material_manager";
import { MeshManager } from "./data/meshes/mesh_manager";
import { SceneManager } from "./data/scene/scene_manager";
import { IFrameListener } from "./data/traits/frame_listener";
import { IdentifierPool } from "./identifier_pool";
import { GameIO } from "./io/io";
import { BRDFLUTRenderer } from "./render/brdf_lut/brdf_lut_renderer";
import { CubemapConvolutionRenderer } from "./render/cubemap_convolution/cubemap_convolution_renderer";
import { CubemapPrefilterRenderer } from "./render/cubemap_prefilter/cubemap_prefilter_renderer";
import { EquirectangularToCubemapRenderer } from "./render/equirec_to_cubemap/equirec_to_cubemap_renderer";
import { Renderer } from "./render/renderer";
import { VanillaRenderer } from "./render/vanilla/vanilla_renderer";

export class Engine {
    
    private _renderer: Renderer = new VanillaRenderer();
    private _shouldRender: boolean = false;

    private _idPool = new IdentifierPool();

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

    constructor() {
        this.renderLoop();
    }

    private async renderLoop() {
        if (this._shouldRender) {
            this._frameListeners.forEach(fl => {
                if (fl.onEachFrame) fl.onEachFrame();
            });
            await this._renderer.render();
        }
        requestAnimationFrame(() => this.renderLoop());
    }

    pauseRender() {
        this._shouldRender = false;
    }

    async initializeRenderers() {
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