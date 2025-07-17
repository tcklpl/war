import type { GLTFAnimationChannel } from './gltf-animation-channel';
import type { GLTFAnimationSampler } from './gltf-animation-sampler';

export class GLTFAnimation {
	constructor(
		private readonly _name: string,
		private readonly _samplers: GLTFAnimationSampler[],
		private readonly _channels: GLTFAnimationChannel[],
	) {}

	get name() {
		return this._name;
	}

	get channels() {
		return this._channels;
	}

	get samplers() {
		return this._samplers;
	}
}
