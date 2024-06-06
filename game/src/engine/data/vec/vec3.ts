import { BadVectorLengthError } from '../../../errors/engine/data/bad_vector_length';
import { MathUtils } from '../../../utils/math_utils';
import { Vec2 } from './vec2';

export class Vec3 extends Vec2 {
    constructor(
        x: number,
        y: number,
        public z: number,
    ) {
        super(x, y);
    }

    static get byteSize() {
        return 4 * 3;
    }

    get values() {
        return [this.x, this.y, this.z];
    }

    equals(other: Vec3) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    add(v: Vec3) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    subtract(v: Vec3) {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    clamp(min: Vec3, max: Vec3) {
        return new Vec3(
            MathUtils.clamp(min.x, max.x, this.x),
            MathUtils.clamp(min.y, max.y, this.y),
            MathUtils.clamp(min.z, max.z, this.z),
        );
    }

    clampFactor(min: number, max: number) {
        return new Vec3(
            MathUtils.clamp(min, max, this.x),
            MathUtils.clamp(min, max, this.y),
            MathUtils.clamp(min, max, this.z),
        );
    }

    multiplyFactor(factor: number) {
        return new Vec3(this.x * factor, this.y * factor, this.z * factor);
    }

    divideFactor(factor: number) {
        return new Vec3(this.x / factor, this.y / factor, this.z / factor);
    }

    min(v: Vec3) {
        return new Vec3(Math.min(this.x, v.x), Math.min(this.y, v.y), Math.min(this.z, v.z));
    }

    max(v: Vec3) {
        return new Vec3(Math.max(this.x, v.x), Math.max(this.y, v.y), Math.max(this.z, v.z));
    }

    squaredNorm() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }

    normalize() {
        let length = Math.sqrt(this.squaredNorm());
        return length > 0.00001 ? new Vec3(this.x / length, this.y / length, this.z / length) : Vec3.fromValue(0);
    }

    inverse() {
        return this.multiplyFactor(-1);
    }

    // -----------------[ SWIZZLES ]-----------------

    get xyz() {
        return new Vec3(this.x, this.y, this.z);
    }

    // -----------------[ STATIC UTILS ]-----------------

    static fromValue(val: number) {
        return new Vec3(val, val, val);
    }

    static fromArray(a: number[]) {
        if (a.length !== 3)
            throw new BadVectorLengthError(`Trying to create vec3 with an array of ${a.length} elements`);
        return new Vec3(a[0], a[1], a[2]);
    }

    static get zero() {
        return new Vec3(0, 0, 0);
    }

    static get up() {
        return new Vec3(0, 1, 0);
    }

    static cross(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    }

    static dot(a: Vec3, b: Vec3) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static centroid(v: Vec3[]): Vec3 {
        let accumulated = v.reduce((accumulated, current) => accumulated.add(current), Vec3.zero);
        return accumulated.divideFactor(v.length);
    }

    static interpolate(a: Vec3, b: Vec3, n: number) {
        const xDiff = a.x - b.x;
        const yDiff = a.y - b.y;
        const zDiff = a.z - b.z;
        return new Vec3(a.x + xDiff * n, a.y + yDiff * n, a.z + zDiff * n);
    }
}
