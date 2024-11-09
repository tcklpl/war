import { GLTFAnimationChannel } from './gltf_animation_channel';
import { GLTFAnimationSampler } from './gltf_animation_sampler';

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
