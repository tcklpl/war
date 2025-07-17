import type { GLTFAnimationChannelTarget } from './gltf-animation-channel-target';
import type { GLTFAnimationSampler } from './gltf-animation-sampler';

export class GLTFAnimationChannel {
	constructor(
		private readonly _sampler: GLTFAnimationSampler,
		private readonly _target: GLTFAnimationChannelTarget,
	) {}

	get sampler() {
		return this._sampler;
	}

	get target() {
		return this._target;
	}
}
