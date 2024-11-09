import { FailedToGetNearestKeyframesError } from '../../../errors/engine/data/animation/failed_to_get_nearest_keyframes';
import { InvalidAnimationTargetError } from '../../../errors/engine/data/animation/invalid_animation_target';
import { InvalidInterpolationTypeError } from '../../../errors/engine/data/animation/invalid_interpolation_type';
import { AnimationUtils } from '../../../utils/animation_utils';
import { Animatable, AnimationValue, EncodedAnimationTarget } from './animatable';
import { Animation } from './animation';
import { OffsetEncodedAnimationTarget } from './offset_encoded_animation_target';

export class AnimationPlayback<T extends Animatable> {
    private readonly _initialState = new Map<string, EncodedAnimationTarget>();
    private readonly _keyframes = new Map<string, OffsetEncodedAnimationTarget[]>();
    private _curOffset = 0;

    constructor(
        private readonly _animation: Animation<T>,
        private readonly _target: T,
    ) {
        this.cloneAnimationFrames();
        this.buildInitialState();
        this.transformSettersToIncrementors();
    }

    /**
     * Clones the animation frames to our own instance here, as they can get modified
     */
    private cloneAnimationFrames() {
        this._animation.keyframes.forEach((kf, key) => {
            this._keyframes.set(
                key,
                kf.map(f => {
                    const clone = structuredClone(f);
                    // structured clone only clones basic objects, we need to call .clone on vec3s and quaternions
                    clone.target.value = AnimationUtils.cloneAnimationValue(f.target.value);
                    return clone;
                }),
            );
        });
    }

    /**
     * Transforms all setters keyframes into incrementors using the initial state.
     * This is needed to allow the puppeteer to just accumulate all animations.
     */
    private transformSettersToIncrementors() {
        // Initialize accumulators with the starting transformations
        const accumulators = new Map<string, AnimationValue>();
        this._initialState.forEach(t => accumulators.set(t.target, t.value));

        const addToAccumulator = (channel: string, value: AnimationValue) => {
            const curValue = accumulators.get(channel);
            if (!curValue) {
                throw new InvalidAnimationTargetError(`Trying to accumulate unknown channel '${channel}'`);
            }
            const finalValue = AnimationUtils.incrementAnimationValue(curValue, value);
            accumulators.set(channel, finalValue);
        };

        const transformSetterToIncrementor = (at: OffsetEncodedAnimationTarget, diff: AnimationValue) => {
            const target = at.target;
            target.type = 'incrementor';
            target.value = diff;
        };

        this._keyframes.forEach(kfTargets => {
            kfTargets.forEach(kf => {
                // Just accumulate the value if the keyframe is an incrementor
                if (kf.target.type === 'incrementor') {
                    addToAccumulator(kf.target.target, kf.target.value);
                    return;
                }
                // We need to get the difference if the keyframe is a setter
                const curValue = accumulators.get(kf.target.target);
                if (!curValue) {
                    throw new InvalidAnimationTargetError(`Trying to accumulate unknown setter '${kf.target.target}'`);
                }
                const diff = AnimationUtils.differenceBetweenValues(curValue, kf.target.value);
                addToAccumulator(kf.target.target, diff);
                transformSetterToIncrementor(kf, diff);
            });
        });
    }

    /**
     * Builds the initial object state using the animation channels and getters.
     */
    private buildInitialState() {
        this._animation.transformationTargets.forEach(target => {
            const getter = this._animation.getGetterByTransformationTarget(target);
            const setter = this._animation.getSetterByTransformationTarget(target);

            let value = this._target.animation.getters[getter]();
            if (this._animation.startsAt === 'absolute') {
                const firstValue = this._animation.assertGetKeyframesFor(target)[0];
                value = firstValue.target.value;
            }

            const at = {
                type: 'setter',
                target,
                getter,
                setter,
                interpolation: 'step',
                value,
            } as EncodedAnimationTarget;
            this._initialState.set(target, at);
        });
    }

    /**
     * Searches for the nearest keyframes to an absolute offset (predecessor and successor), for example:
     *
     * Channel ----------o--------------o--------o--------------------------------------------------o----
     *         |         |          |          |          |          |          |          |          |
     *         0         10         20         30         40         50         60         70         80
     *
     * Offset 5 will return [null, <frame at 10>],
     * Offset 20 will return [<frame at 10>, <frame at 24>],
     * Offset 30 will return [<frame at 24>, <frame at 32>],
     * Offset 80 will return [<frame at 78>, null].
     *
     * @param channel Animation target channel
     * @param offset Absolute offset
     * @returns 1 of or both nearest keyframes
     */
    private getNearestInterpolationKeyframes(channel: string, offset: number) {
        const channelKeyframes = this._keyframes.get(channel);
        if (!channelKeyframes) {
            throw new InvalidAnimationTargetError(`Failed to get animation channel ${channel}`);
        }
        let predecessor: OffsetEncodedAnimationTarget | null = null;
        let successor: OffsetEncodedAnimationTarget | null = null;
        channelKeyframes.forEach(keyframe => {
            if (keyframe.offset >= (predecessor?.offset ?? 0) && keyframe.offset < offset) {
                predecessor = keyframe;
            }
            if (keyframe.offset <= (successor?.offset ?? Infinity) && keyframe.offset > offset) {
                successor = keyframe;
            }
        });
        if (!predecessor && !successor) {
            throw new FailedToGetNearestKeyframesError(
                `Failed to get nearest keyframes for animation ${this._animation.name}. Pre: ${predecessor} Suc: ${successor}`,
            );
        }
        return [predecessor, successor] as (OffsetEncodedAnimationTarget | null)[];
    }

    /**
     * Interpolates one target between two keyframes, returning partial increments for the frame.
     *
     * @param predecessor Predecessor keyframe
     * @param successor Successor keyframe
     * @param offset Absolute offset
     * @param deltaFrame Seconds since last frame
     * @returns Frame increments
     */
    private interpolateKeyframes(
        predecessor: OffsetEncodedAnimationTarget,
        successor: OffsetEncodedAnimationTarget,
        offset: number,
        deltaFrame: number,
    ) {
        // Deal with step interpolation, which only changes when the value reaches the set offset
        if (successor.target.interpolation === 'step') {
            return offset === successor.offset ? successor.target : predecessor.target;
        }

        const duration = successor.offset - predecessor.offset;
        const increment = AnimationUtils.getIncrementPerFrame(successor.target.value, duration, deltaFrame);

        // Linear animations
        if (successor.target.interpolation === 'linear') {
            return {
                target: successor.target.target,
                type: 'incrementor',
                getter: successor.target.getter,
                setter: successor.target.setter,
                value: increment,
                interpolation: 'linear',
            } as EncodedAnimationTarget;
        }

        throw new InvalidInterpolationTypeError(
            `Invalid interpolation '${successor.target.interpolation}' for animation ${this._animation.name}`,
        );
    }

    /**
     * Interpolates all of the animation targets to the required offset.
     *
     * @param offset Seconds offset
     * @param deltaFrame Seconds since last frame
     * @returns All transformations, interpolated to the required offset
     */
    interpolateOffsetTransformations(offset: number, deltaFrame: number) {
        if (offset <= 0) {
            return new Map();
        }
        if (offset >= this._animation.lengthSeconds) {
            return new Map();
        }
        const interpolatedTransformations = new Map<string, EncodedAnimationTarget>();
        this._animation.transformationTargets.forEach(tt => {
            const [predecessor, successor] = this.getNearestInterpolationKeyframes(tt, offset);

            if (predecessor && successor) {
                return interpolatedTransformations.set(
                    tt,
                    this.interpolateKeyframes(predecessor, successor, offset, deltaFrame),
                );
            }
            if (!predecessor && successor) {
                const initialState = this._initialState.get(tt);
                if (!initialState) {
                    throw new InvalidAnimationTargetError(`Failed to get initial state for property '${tt}'`);
                }
                return interpolatedTransformations.set(
                    tt,
                    this.interpolateKeyframes(
                        {
                            offset: 0,
                            target: initialState,
                        },
                        successor,
                        offset,
                        deltaFrame,
                    ),
                );
            }
        });
        return interpolatedTransformations;
    }

    /**
     * Adds the offset to the animation and returns all the calculated increments for the new offset.
     *
     * @param delta Seconds since last frame
     * @returns All transformation increments for the new accumulated offset
     */
    updateOffset(delta: number) {
        this._curOffset += delta;
        return this.interpolateOffsetTransformations(this._curOffset, delta);
    }

    get isFinished() {
        return this._curOffset > this._animation.lengthSeconds;
    }
}
