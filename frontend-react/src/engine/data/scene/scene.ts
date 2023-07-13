import { Camera } from "../../camera/camera";
import { Entity } from "../../entity/entity";

export class Scene {

    private _activeCamera?: Camera;
    
    constructor(private _name: string, private _entities: Entity[], private _cameras: Camera[]) {

    }

    get activeCamera() {
        if (!this._activeCamera && this._cameras.length > 0) {
            console.log(`Scene '${this._name}' doesn't have an active camera, setting the first one as active`);
            this._activeCamera = this._cameras[0];
        }
        return this._activeCamera;
    }

    get entitiesToRender() {
        return this._entities;
    }

}