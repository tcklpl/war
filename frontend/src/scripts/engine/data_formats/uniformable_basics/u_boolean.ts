import { IUniformable } from "../../traits/uniformable";

export class UBoolean implements IUniformable {

    private _value: boolean;

    constructor(value?: boolean) {
        this._value = value || false;
    }

    setUniform(gl: WebGL2RenderingContext, to: WebGLUniformLocation): void {
        gl.uniform1i(to, this._value ? 1 : 0);
    }

    public get value() {
        return this._value;
    }

    public set value(v: boolean) {
        this._value = v;
    }

    
}