import { FPSCamera } from "../engine/camera/fps_camera";
import { Vec3 } from "../engine/data_formats/vec/vec3";

export class GameCamera extends FPSCamera {

    constructor() {
        super(new Vec3(0, 10, 0), new Vec3(0, 0, 1), 0, 0);
    }
    
}