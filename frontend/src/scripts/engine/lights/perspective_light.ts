import { Mat4 } from "../data_formats/mat/mat4";
import { MUtils } from "../data_formats/math_utils";
import { Light } from "./light";
import { ILightCreationInfo } from "./light_creation_info";

export class PerspectiveLight extends Light {

    private fovRadians: number;
    private aspect: number;

    constructor(info: ILightCreationInfo, aspect: number, fov: number) {
        super(info);
        this.aspect = aspect;
        this.fovRadians = MUtils.degToRad(fov);
        this.generateProjectionMatrix();
        this.postConstruct();
    }

    generateProjectionMatrix(): void {
        this.projectionMatrix = Mat4.perspective(this.fovRadians, this.aspect, this._info.near, this._info.far);
    }
}