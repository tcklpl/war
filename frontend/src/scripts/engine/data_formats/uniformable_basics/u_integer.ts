import { IUniformable } from "../../traits/uniformable";

export class UInteger implements IUniformable {

    private _value: number;

    constructor(value?: number) {
        if (value) {
            if (!Number.isInteger(value)) throw `Failed to set UInteger as a non integer value`;
            this._value = value;
        } else {
            this._value = 0;
        }
    }

    setUniform(gl: WebGL2RenderingContext, to: WebGLUniformLocation): void {
        gl.uniform1i(to, this._value);
    }

    public get value() {
        return this._value;
    }

    public set value(n: number) {
        if (!Number.isInteger(n)) throw `Failed to set UInteger as a non integer value`;
        this._value = this.value;
    }
    
}