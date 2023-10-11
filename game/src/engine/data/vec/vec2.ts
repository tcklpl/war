import { MathUtils } from "../../../utils/math_utils";

export class Vec2 {

    constructor(public x: number, public y: number) { }

    static get byteSize() {
        return 4 * 2;
    }

    get values() {
        return [this.x, this.y];
    }

    get asF32Array() {
        return new Float32Array(this.values);
    }

    equals(other: Vec2) {
        return this.x === other.x && this.y === other.y;
    }

    add(v: Vec2) {
        return new Vec2(
            this.x + v.x,
            this.y + v.y
        );
    }

    subtract(v: Vec2) {
        return new Vec2(
            this.x - v.x,
            this.y - v.y
        );
    }

    clamp(min: Vec2, max: Vec2) {
        return new Vec2(
            MathUtils.clamp(min.x, max.x, this.x),
            MathUtils.clamp(min.y, max.y, this.y)
        );
    }

    clampFactor(min: number, max: number) {
        return new Vec2(
            MathUtils.clamp(min, max, this.x),
            MathUtils.clamp(min, max, this.y)
        );
    }

    multiplyFactor(factor: number) {
        return new Vec2(
            this.x * factor,
            this.y * factor
        );
    }

    divideFactor(factor: number) {
        return new Vec2(
            this.x / factor,
            this.y / factor
        );
    }

    min(v: Vec2) {
        return new Vec2(
            Math.min(this.x, v.x),
            Math.min(this.y, v.y)
        );
    }

    max(v: Vec2) {
        return new Vec2(
            Math.max(this.x, v.x),
            Math.max(this.y, v.y)
        );
    }

    get xy() {
        return new Vec2(this.x, this.y);
    }

    // -----------------[ STATIC UTILS ]-----------------

    static fromValue(val: number) {
        return new Vec2(val, val);
    }

    static interpolate(a: Vec2, b: Vec2, n: number) {
        const xDiff = a.x - b.x;
        const yDiff = a.y - b.y;
        return new Vec2(a.x + (xDiff * n), a.y + (yDiff * n));
    }
}