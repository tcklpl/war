import { MUtils } from "../math_utils";
import { Vec3 } from "./vec3";

export class Vec4 extends Vec3 {

    constructor(x: number, y: number, z: number, w: number) {
        super(x, y, z);
        this._values[3] = w;
    }

    public get w() {
        return this._values[3];
    }

    public set w(v: number) {
        this._values[3] = v;
    }

    differentFrom(other: Vec4) {
        return this.x != other.x || this.y != other.y || this.z != other.z || this.w != other.w;
    }

    static fromId(id: number): Vec4 {
        return new Vec4(
            ((id >>  0) & 0xFF) / 0xFF,
            ((id >>  8) & 0xFF) / 0xFF,
            ((id >> 16) & 0xFF) / 0xFF,
            ((id >> 24) & 0xFF) / 0xFF
        );
    }

    static clamp(min: Vec4, max: Vec4, value: Vec4) {
        return new Vec4(
            MUtils.clamp(min.x, max.x, value.x),
            MUtils.clamp(min.y, max.y, value.y),
            MUtils.clamp(min.z, max.z, value.z),
            MUtils.clamp(min.w, max.w, value.w)
        );
    }
}