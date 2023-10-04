import { BadVectorLengthError } from "../../../errors/engine/data/bad_vector_length";
import { MathUtils } from "../../../utils/math_utils";
import { Vector } from "./vector";

export class Vec3 extends Vector {

    constructor(x: number, y: number, z: number) {
        super([x, y, z]);
    }

    static get byteSize() {
        return 4 * 3;
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

    set x(val: number) {
        this._values[0] = val;
    }

    set y(val: number) {
        this._values[1] = val;
    }

    set z(val: number) {
        this._values[2] = val;
    }

    equals(other: Vec3) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    add(v: Vec3) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    multiplyByVec3(other: Vec3) {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }

    squaredNorm() {
        return this.x**2 + this.y**2 + this.z**2;
    }

    normalize() {
        let length = Math.sqrt(this.squaredNorm());
        if (length >  0.00001) {
            this.x /= length;
            this.y /= length;
            this.z /= length;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }

    inverse() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }

    // -----------------[ STATIC UTILS ]-----------------

    static get zero() {
        return new Vec3(0, 0, 0);
    }

    static get up() {
        return new Vec3(0, 1, 0);
    }

    static fromValue(val: number) {
        return new Vec3(val, val, val);
    }

    static cross(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }

    static dot(a: Vec3, b: Vec3) {
        return (
            a.x * b.x +
            a.y * b.y +
            a.z * b.z
        );
    }

    static add(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(
            a.x + b.x,
            a.y + b.y,
            a.z + b.z
        );
    }

    static subtract(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(
            a.x - b.x,
            a.y - b.y,
            a.z - b.z
        );
    }

    static multiplyByValue(a: Vec3, b: number) {
        return new Vec3(
            a.x * b,
            a.y * b,
            a.z * b
        )
    }

    static normalize(v: Vec3) {
        let length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        // no division by 0
        return length > 0.00001 ? new Vec3(v.x / length, v.y / length, v.z / length) : new Vec3(0, 0, 0);
    }

    static centroid(v: Vec3[]): Vec3 {
        let accumulated = v.reduce((accumulated, current) => Vec3.add(accumulated, current), Vec3.zero);
        accumulated.divideByFactor(v.length);
        return accumulated;
    }

    static clamp(min: Vec3, max: Vec3, value: Vec3) {
        return new Vec3(
            MathUtils.clamp(min.x, max.x, value.x),
            MathUtils.clamp(min.y, max.y, value.y),
            MathUtils.clamp(min.z, max.z, value.z)
        );
    }

    static interpolate(a: Vec3, b: Vec3, n: number) {
        const xDiff = a.x - b.x;
        const yDiff = a.y - b.y;
        const zDiff = a.z - b.z;
        return new Vec3(a.x + (xDiff * n), a.y + (yDiff * n), a.z + (zDiff * n));
    }

    static fromArray(a: number[]) {
        if (a.length !== 3) throw new BadVectorLengthError(`Trying to create vec3 with an array of ${a.length} elements`);
        return new Vec3(a[0], a[1], a[2]);
    }
}