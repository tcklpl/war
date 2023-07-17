import { CameraManager } from "./camera/camera_manager";
import { MeshManager } from "./data/meshes/mesh_manager";
import { SceneManager } from "./data/scene/scene_manager";
import { IFrameListener } from "./data/traits/frame_listener";
import { IdentifierPool } from "./identifier_pool";
import { Renderer } from "./render/renderer";
import { VanillaRenderer } from "./render/vanilla/vanilla_renderer";

export class Engine {
    
    private _renderer: Renderer = new VanillaRenderer();
    private _shouldRender: boolean = true;

    private _idPool = new IdentifierPool();

    private _managers = {
        camera: new CameraManager(),
        mesh: new MeshManager(),
        scene: new SceneManager()
    }

    private _frameListeners: IFrameListener[] = [];

    private renderLoop() {
        this._frameListeners.forEach(fl => {
            if (fl.onEachFrame) fl.onEachFrame();
        });
        if (this._shouldRender) {
            this._renderer.render();
        }
        requestAnimationFrame(() => this.renderLoop());
    }

    pauseRender() {
        this._shouldRender = false;
    }

    resumeRender() {
        this._shouldRender = true;
    }

    registerFrameListener(l: IFrameListener) {
        this._frameListeners.push(l);
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

}