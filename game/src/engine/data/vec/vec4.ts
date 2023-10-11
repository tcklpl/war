import { BadVectorLengthError } from "../../../errors/engine/data/bad_vector_length";
import { MathUtils } from "../../../utils/math_utils";
import { Vec3 } from "./vec3";

export class Vec4 extends Vec3 {

    constructor(x: number, y: number, z: number, public w: number) {
        super(x, y, z);
    }

    static get byteSize() {
        return 4 * 4;
    }

    get values() {
        return [this.x, this.y, this.z, this.w];
    }
    
    equals(other: Vec4) {
        return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    }

    add(v: Vec4) {
        return new Vec4(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z,
            this.w + v.w
        );
    }

    subtract(v: Vec4) {
        return new Vec4(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z,
            this.w - v.w
        );
    }

    clamp(min: Vec4, max: Vec4) {
        return new Vec4(
            MathUtils.clamp(min.x, max.x, this.x),
            MathUtils.clamp(min.y, max.y, this.y),
            MathUtils.clamp(min.z, max.z, this.z),
            MathUtils.clamp(min.w, max.w, this.w)
        );
    }

    clampFactor(min: number, max: number) {
        return new Vec4(
            MathUtils.clamp(min, max, this.x),
            MathUtils.clamp(min, max, this.y),
            MathUtils.clamp(min, max, this.z),
            MathUtils.clamp(min, max, this.w)
        );
    }

    multiplyFactor(factor: number) {
        return new Vec4(
            this.x * factor,
            this.y * factor,
            this.z * factor,
            this.w * factor
        );
    }

    divideFactor(factor: number) {
        return new Vec4(
            this.x / factor,
            this.y / factor,
            this.z / factor,
            this.w / factor
        );
    }

    min(v: Vec4) {
        return new Vec4(
            Math.min(this.x, v.x),
            Math.min(this.y, v.y),
            Math.min(this.z, v.z),
            Math.min(this.w, v.w)
        );
    }

    max(v: Vec4) {
        return new Vec4(
            Math.max(this.x, v.x),
            Math.max(this.y, v.y),
            Math.max(this.z, v.z),
            Math.max(this.w, v.w)
        );
    }

    // -----------------[ SWIZZLES ]-----------------

    get xyzw() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    get wxyz() {
        return new Vec4(this.w, this.x, this.y, this.z);
    }

    // -----------------[ STATIC UTILS ]-----------------

    static fromValue(v: number) {
        return new Vec4(v, v, v, v);
    }

    static fromArray(a: number[]) {
        if (a.length !== 4) throw new BadVectorLengthError(`Trying to create vec4 with an array of ${a.length} elements`);
        return new Vec4(a[0], a[1], a[2], a[3]);
    }

    static centroid(v: Vec4[]) {
        return v.reduce((accumulated, current) => accumulated.add(current), Vec4.fromValue(0)).divideFactor(v.length);
    }
}