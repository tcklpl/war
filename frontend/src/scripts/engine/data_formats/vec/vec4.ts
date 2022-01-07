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

    static fromId(id: number): Vec4 {
        return new Vec4(
            ((id >>  0) & 0xFF) / 0xFF,
            ((id >>  8) & 0xFF) / 0xFF,
            ((id >> 16) & 0xFF) / 0xFF,
            ((id >> 24) & 0xFF) / 0xFF
        );
    }
}