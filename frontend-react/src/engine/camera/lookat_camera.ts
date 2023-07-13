import { Mat4 } from "../data/mat/mat4";
import { Vec3 } from "../data/vec/vec3";
import { Camera } from "./camera";


export class LookAtCamera extends Camera {

    private _target: Vec3;

    constructor(pos: Vec3, up: Vec3, target: Vec3) {
        super(pos, up);
        this._target = target;
        this.generateCameraMatrix();
    }

    generateCameraMatrix(): void {
        this.cameraMatrix = Mat4.lookAt(this.position, this._target, this.up);
    }
}