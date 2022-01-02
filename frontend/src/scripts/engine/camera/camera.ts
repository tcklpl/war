import { Mat4 } from "../data_formats/mat/mat4";
import { Vec3 } from "../data_formats/vec/vec3";

export abstract class Camera {

    protected worldPos: Vec3;
    protected cameraUp: Vec3;
    protected viewMatrix!: Mat4;

    constructor(worldPos: Vec3, up: Vec3) {
        this.worldPos = worldPos;
        this.cameraUp = up;
    }

    abstract generateViewMatrix(): void;

    public get viewMat4() {
        return this.viewMatrix;
    }

}