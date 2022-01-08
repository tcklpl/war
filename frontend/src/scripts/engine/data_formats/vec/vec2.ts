import { MUtils } from "../math_utils";

export class Vec2 {

    protected _values: number[];

    constructor(x: number, y: number) {
        this._values = [x, y];
    }

    differentFrom(other: Vec2) {
        return this.x != other.x || this.y != other.y;
    }

    public get values() {
        return this._values;
    }

    public get x() {
        return this._values[0];
    }

    public set x(v: number) {
        this._values[0] = v;
    }

    public get y() {
        return this._values[1];
    }

    public set y(v: number) {
        this._values[1] = v;
    }

    static clamp(min: Vec2, max: Vec2, value: Vec2) {
        return new Vec2(
            MUtils.clamp(min.x, max.x, value.x),
            MUtils.clamp(min.y, max.y, value.y)
        );
    }

}