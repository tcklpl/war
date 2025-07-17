import type { GLTFAnimationSamplerInterpolation } from 'gltf';
import type { GLTFAccessor } from './gltf-accessor';

export class GLTFAnimationSampler {
	constructor(
		private readonly _seconds: GLTFAccessor,
		private readonly _values: GLTFAccessor,
		private readonly _interpolation: GLTFAnimationSamplerInterpolation,
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
