import { InvalidAnimationTargetError } from '../../../errors/engine/data/animation/invalid_animation_target';
import { Animatable } from './animatable';
import { AnimationPlayback } from './animation_playback';
import { OffsetEncodedAnimationTarget } from './offset_encoded_animation_target';
import { AnimationStep } from './state/animation_step';
import { FrameZeroCurrent } from './state/frame_zero_current';

export class Animation<T extends Animatable> {
    readonly lengthSeconds: number;
    private readonly _keyframes = new Map<string, OffsetEncodedAnimationTarget[]>();
    private readonly _transformationTargets: string[] = [];
    private _startsAt: 'current' | 'absolute' = 'absolute';

    constructor(
        readonly name: string,
        private readonly _steps: AnimationStep<T>[],
    ) {
        this.lengthSeconds = _steps[_steps.length - 1].offset;
        this.buildKeyframes();
    }

    private buildKeyframes() {
        // copy all step targets to the keyframe map
        this._steps
            .sort((a, b) => a.offset - b.offset)
            .forEach(step => {
                step.deltas.forEach(delta => {
                    const currentDeltas = this._keyframes.get(delta.target) ?? [];

                    // Register keyframe
                    currentDeltas.push({ offset: step.offset, target: delta });
                    this._keyframes.set(delta.target, currentDeltas);

                    // Add to the target list
                    if (!this._transformationTargets.includes(delta.target))
                        this._transformationTargets.push(delta.target);
                });
            });

        this._startsAt = this._steps[0] instanceof FrameZeroCurrent ? 'current' : 'absolute';
    }

    getGetterByTransformationTarget(target: string) {
        if (!this._keyframes.has(target)) {
            throw new InvalidAnimationTargetError(`Trying to get getter for unavailable animation target '${target}'`);
        }
        return (this._keyframes.get(target) as OffsetEncodedAnimationTarget[])[0].target.getter;
    }

    getSetterByTransformationTarget(target: string) {
        if (!this._keyframes.has(target)) {
            throw new InvalidAnimationTargetError(`Trying to get setter for unavailable animation target '${target}'`);
        }
        return (this._keyframes.get(target) as OffsetEncodedAnimationTarget[])[0].target.setter;
    }

    assertGetKeyframesFor(target: string) {
        if (!this.keyframes.has(target)) {
            throw new InvalidAnimationTargetError(
                `Trying to get keyframes for unavailable animation target '${target}'`,
            );
        }
        return this._keyframes.get(target) as OffsetEncodedAnimationTarget[];
    }

    hasChannel(channel: string) {
        return this.keyframes.has(channel);
    }

    newPlaybackFor<S extends T>(target: S) {
        return new AnimationPlayback(this, target);
    }

    get keyframes() {
        return this._keyframes;
    }

    get startsAt() {
        return this._startsAt;
    }

    get transformationTargets() {
        return this._transformationTargets;
    }
}
