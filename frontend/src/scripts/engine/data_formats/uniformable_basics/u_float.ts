import { IUniformable } from "../../traits/uniformable";

export class UFloat implements IUniformable {

    private _value: number;

    constructor(value?: number) {
        this._value = value || 0;
    }

    setUniform(gl: WebGL2RenderingContext, to: WebGLUniformLocation): void {
        gl.uniform1f(to, this._value);
    }

    public get value() {
        return this._value;
    }

    public set value(n: number) {
        this._value = this.value;
    }
    
}