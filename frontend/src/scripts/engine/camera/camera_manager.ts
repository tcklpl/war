import { Game } from "../../game";
import { Camera } from "./camera";

export class CameraManager {

    private activeCamera?: Camera;
    private allCameras: Camera[] = [];

    registerCamera(camera: Camera) {
        this.allCameras.push(camera);
    }

    setActiveCamera(camera: Camera) {
        if (!this.allCameras.some(c => c == camera)) throw `Could not set camera as active because it's not a registered camera`;
        this.activeCamera = camera;
    }

    updateView() {
        if (this.activeCamera)
            Game.instance.getEngine().shaders.setUniformMat4OnAllPrograms('u_view', this.activeCamera?.viewMat4);
    }

    get active() {
        return this.activeCamera;
    }

    get all() {
        return this.allCameras;
    }

}