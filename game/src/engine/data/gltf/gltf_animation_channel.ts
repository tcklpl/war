import { GLTFAnimationSampler } from './gltf_animation_sampler';
import { GLTFAnimationChannelTarget } from './gltf_animation_channel_target';

export class GLTFAnimationChannel {
    constructor(
        private _sampler: GLTFAnimationSampler,
        private _target: GLTFAnimationChannelTarget,
    ) {}

    get sampler() {
        return this._sampler;
    }

    get target() {
        return this._target;
    }
}
