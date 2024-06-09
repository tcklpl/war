import { GLTFAnimationSamplerInterpolation } from 'gltf';
import { GLTFAccessor } from './gltf_accessor';

export class GLTFAnimationSampler {
    constructor(
        private _seconds: GLTFAccessor,
        private _values: GLTFAccessor,
        private _interpolation: GLTFAnimationSamplerInterpolation,
    ) {}

    get seconds() {
        return this._seconds;
    }

    get values() {
        return this._values;
    }

    get interpolation() {
        return this._interpolation;
    }
}
