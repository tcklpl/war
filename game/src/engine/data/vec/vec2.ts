import { MathUtils } from "../../../utils/math_utils";
import { Vector } from "./vector";

export class Vec2 extends Vector {

    constructor(x: number, y: number) {
        super([x, y]);
    }

    static get byteSize() {
        return 4 * 2;
    }

    get x() {
        return this._values[0];
    }

    get y() {
        return this._values[1];
    }

    set x(val: number) {
        this._values[0] = val;
    }

    set y(val: number) {
        this._values[1] = val;
    }

    equals(other: Vec2) {
        return this.x === other.x && this.y === other.y;
    }

    // -----------------[ STATIC UTILS ]-----------------

    static subtract(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(
            a.x - b.x,
            a.y - b.y
        );
    }

    static clamp(min: Vec2, max: Vec2, value: Vec2) {
        return new Vec2(
            MathUtils.clamp(min.x, max.x, value.x),
            MathUtils.clamp(min.y, max.y, value.y)
        );
    }

    static fromValue(val: number) {
        return new Vec2(val, val);
    }

    static interpolate(a: Vec2, b: Vec2, n: number) {
        const xDiff = a.x - b.x;
        const yDiff = a.y - b.y;
        return new Vec2(a.x + (xDiff * n), a.y + (yDiff * n));
    }
}