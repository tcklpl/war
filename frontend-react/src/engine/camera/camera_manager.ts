import { Manager } from "../manager";
import { Camera } from "./camera";

export class CameraManager extends Manager<Camera> {
    
    private _active?: Camera;

    get active() {
        return this._active;
    }

    set active(cam: Camera | undefined) {
        this._active = cam;
    }
}