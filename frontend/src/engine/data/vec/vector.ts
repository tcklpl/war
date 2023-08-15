import { MathUtils } from "../../../utils/math_utils";
import { IUniformBindable } from "../traits/i_uniform_bindable";

export abstract class Vector implements IUniformBindable {

    protected _values: number[];

    protected constructor(values: number[]) {
        this._values = values;
    }

    get values() {
        return this._values;
    }

    get asF32Array() {
        return new Float32Array(this._values);
    }

    abstract bindUniform(to: WebGLUniformLocation): void;

    clamp(min: number, max: number) {
        this._values = this._values.map(x => MathUtils.clamp(min, max, x));
        return this;
    }

}