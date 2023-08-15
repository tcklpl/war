import { BadVectorLengthError } from "../../../errors/engine/data/bad_vector_length";
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
}