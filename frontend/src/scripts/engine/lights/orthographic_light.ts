import { Mat4 } from "../data_formats/mat/mat4";
import { Light } from "./light";
import { ILightCreationInfo } from "./light_creation_info";

export class OrthographicLight extends Light {

    private width: number;
    private height: number;

    constructor(info: ILightCreationInfo, width: number, height: number) {
        super(info);
        this.width = width;
        this.height = height;
        this.generateProjectionMatrix();
        this.postConstruct();
    }

    generateProjectionMatrix(): void {
        this.projectionMatrix = Mat4.orthographic(-this.width / 2, this.width / 2, -this.height / 2, this.height / 2, this._info.near, this._info.far);
    }
}