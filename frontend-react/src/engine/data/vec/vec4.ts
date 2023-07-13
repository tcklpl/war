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

    bindUniform(to: WebGLUniformLocation): void {
        gl.uniform3fv(to, this.asF32Array);
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