import { Mat4 } from "../data_formats/mat/mat4";
import { MUtils } from "../data_formats/math_utils";
import { Vec3 } from "../data_formats/vec/vec3";
import { Camera } from "./camera";

export class FPSCamera extends Camera {

    private pitch: number;
    private yaw: number;

    private cameraFront!: Vec3;
    private cameraDirection: Vec3 = new Vec3(0, 0, 0);

    constructor(worldPos: Vec3, up: Vec3, pitch: number, yaw: number) {
        super(worldPos, up);
        this.pitch = pitch;
        this.yaw = yaw;
        this.generateViewMatrix();
    }

    generateViewMatrix(): void {
        let pitchCos = Math.cos(MUtils.degToRad(this.pitch));
        this.cameraDirection.x = Math.cos(MUtils.degToRad(this.yaw)) * pitchCos;
        this.cameraDirection.y = Math.sin(MUtils.degToRad(this.pitch));
        this.cameraDirection.z = Math.sin(MUtils.degToRad(this.yaw)) * pitchCos;

        this.cameraFront = Vec3.normalize(this.cameraDirection);
        this.viewMatrix = Mat4.lookAt(this.worldPos, Vec3.add(this.worldPos, this.cameraFront), this.cameraUp);
        this.viewMatrix = Mat4.inverse(this.viewMatrix);
    }
}