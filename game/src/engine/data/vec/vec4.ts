import { BadVectorLengthError } from "../../../errors/engine/data/bad_vector_length";
import { Vec3 } from "./vec3";
import { Vector } from "./vector";

export class Vec4 extends Vector {

    constructor(x: number, y: number, z: number, w: number) {
        super([x, y, z, w]);
    }

    static get byteSize() {
        return 4 * 4;
    }

    get x() {
        return this._values[0];
    }

    get y() {
        return this._values[1];
    }

    get z() {
        return this._values[2];
    }

    get w() {
        return this._values[3];
    }

    set x(val: number) {
        this._values[0] = val;
    }

    set y(val: number) {
        this._values[1] = val;
    }

    set z(val: number) {
        this._values[2] = val;
    }

    set w(val: number) {
        this._values[3] = val;
    }

    get xyz() {
        return new Vec3(this.x, this.y, this.z);
    }

    // -----------------[ STATIC UTILS ]-----------------

    static fromId(id: number): Vec4 {
        return new Vec4(
            ((id >>  0) & 0xFF) / 0xFF,
            ((id >>  8) & 0xFF) / 0xFF,
            ((id >> 16) & 0xFF) / 0xFF,
            ((id >> 24) & 0xFF) / 0xFF
        );
    }

    static fromValue(v: number) {
        return new Vec4(v, v, v, v);
    }

    static fromArray(a: number[]) {
        if (a.length !== 4) throw new BadVectorLengthError(`Trying to create vec4 with an array of ${a.length} elements`);
        return new Vec4(a[0], a[1], a[2], a[3]);
    }

    static min(v: Vec4[]) {
        return v.reduce((prev, cur) => {
            prev.x = Math.min(cur.x);
            prev.y = Math.min(cur.y);
            prev.z = Math.min(cur.z);
            prev.w = Math.min(cur.w);
            return prev;
        }, Vec4.fromValue(0));
    }

    static max(v: Vec4[]) {
        return v.reduce((prev, cur) => {
            prev.x = Math.max(cur.x);
            prev.y = Math.max(cur.y);
            prev.z = Math.max(cur.z);
            prev.w = Math.max(cur.w);
            return prev;
        }, Vec4.fromValue(0));
    }

    static add(a: Vec4, b: Vec4) {
        return new Vec4(
            a.x + b.x,
            a.y + b.y,
            a.z + b.z,
            a.w + b.w
        );
    }

    static centroid(v: Vec4[]) {
        return v.reduce((accumulated, current) => Vec4.add(accumulated, current), Vec4.fromValue(0)).divideByFactor(v.length);
    }
}