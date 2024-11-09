import { GLTFAnimationChannelTarget } from './gltf_animation_channel_target';
import { GLTFAnimationSampler } from './gltf_animation_sampler';

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
