import { MathUtils } from "../../../utils/math_utils";

export abstract class Vector  {

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

    clamp(min: number, max: number) {
        this._values = this._values.map(x => MathUtils.clamp(min, max, x));
        return this;
    }

    divideByFactor(factor: number) {
        this._values = this._values.map(x => x / factor);
        return this;
    }

    multiplyByFactor(factor: number) {
        this._values = this._values.map(x => x * factor);
        return this;
    }

}