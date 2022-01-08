import { Mat4 } from "../data_formats/mat/mat4";
import { Vec3 } from "../data_formats/vec/vec3";
import { Camera } from "./camera";

export class LookAtCamera extends Camera {

    protected target: Vec3;

    constructor(worldPos: Vec3, up: Vec3, target: Vec3) {
        super(worldPos, up);
        this.target = target;
        this.generateViewMatrix();
    }

    generateViewMatrix(): void {
        this.viewMatrix = Mat4.lookAt(this.worldPos, this.target, this.cameraUp);
        this.viewMatrix = Mat4.inverse(this.viewMatrix);
    }
    
}