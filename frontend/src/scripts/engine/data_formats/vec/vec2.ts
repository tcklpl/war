export class Vec2 {

    protected _values: number[];

    constructor(x: number, y: number) {
        this._values = [x, y];
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

}