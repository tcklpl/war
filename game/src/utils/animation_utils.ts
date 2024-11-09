import { Animatable, AnimationValue, EncodedAnimationTarget } from '../engine/data/animation/animatable';
import { Quaternion } from '../engine/data/quaternion/quaternion';
import { Vec3 } from '../engine/data/vec/vec3';
import { DifferentAnimationStepValueTypesError } from '../errors/engine/data/animation/different_animation_step_value_types';
import { UnsupportedAnimationStepValueError } from '../errors/engine/data/animation/unsupported_animation_step_value';
import { MathUtils } from './math_utils';

export class AnimationUtils {
    /**
     * Linearly interpolates between a and b with a factor of f (between 0 and 1).
     *
     * @param a Predecessor value
     * @param b Successor value
     * @param factor Interpolation factor between 0 and 1
     * @returns Interpolated Animation Value
     */
    static interpolateValueLinear(a: AnimationValue, b: AnimationValue, factor: number): AnimationValue {
        this.assertSameTypes(a, b);
        if (typeof a === 'number' && typeof b === 'number') {
            return MathUtils.lerp(a, b, factor);
        }
        if (a instanceof Vec3 && b instanceof Vec3) {
            return Vec3.interpolateLinear(a, b, factor);
        }
        if (a instanceof Quaternion && b instanceof Quaternion) {
            return Quaternion.slerp(a, b, factor);
        }
        throw new UnsupportedAnimationStepValueError(`Unsupported animation target value for animation`);
    }

    /**
     * Calculates the animations increment for this frame as:
     *
     * __total___ * deltaFrame
     *  duration
     *
     * @param total Total value to increment overt duration
     * @param duration Total transformation duration
     * @param deltaFrame Seconds since last frame
     * @returns Increment for the total transformation
     */
    static getIncrementPerFrame(total: AnimationValue, duration: number, deltaFrame: number): AnimationValue {
        if (typeof total === 'number') {
            return (total / duration) * deltaFrame;
        }
        if (total instanceof Vec3) {
            return total.divideFactor(duration).multiplyFactor(deltaFrame);
        }
        if (total instanceof Quaternion) {
            return total.divideByFactor(duration).multiplyByFactor(deltaFrame);
        }
        throw new UnsupportedAnimationStepValueError(`Unsupported animation target value for animation`);
    }

    /**
     * Adds increment to the source and returns the result, checking if both are of the same type.
     *
     * @param source Base value
     * @param increment Incrementor value
     * @returns Sum of the two values
     */
    static incrementAnimationValue(source: AnimationValue, increment: AnimationValue): AnimationValue {
        this.assertSameTypes(source, increment);
        if (typeof source === 'number' && typeof increment === 'number') {
            return source + increment;
        }
        if (source instanceof Vec3 && increment instanceof Vec3) {
            return source.add(increment);
        }
        if (source instanceof Quaternion && increment instanceof Quaternion) {
            return source.add(increment);
        }
        throw new UnsupportedAnimationStepValueError(`Unsupported animation target value for animation`);
    }

    /**
     * Gets the difference between 2 animation values.
     *
     * @param a First value
     * @param b Second value
     * @returns Difference between a and b
     */
    static differenceBetweenValues(a: AnimationValue, b: AnimationValue): AnimationValue {
        this.assertSameTypes(a, b);
        if (typeof a === 'number' && typeof b === 'number') {
            return b - a;
        }
        if (a instanceof Vec3 && b instanceof Vec3) {
            return b.subtract(a);
        }
        if (a instanceof Quaternion && b instanceof Quaternion) {
            return b.subtract(a);
        }
        throw new UnsupportedAnimationStepValueError(`Unsupported animation target value for animation`);
    }

    /**
     * Applies the specified transformations to the object, minding if they're setters or incrementors.
     *
     * @param object Target object
     * @param value Transformation to apply
     */
    static applyTransformations(object: Animatable, value: EncodedAnimationTarget) {
        let apply: (value: any) => void;
        switch (value.type) {
            case 'setter':
                apply = object.animation.setters[value.setter];
                break;
            case 'incrementor':
                apply = object.animation.accumulators[value.setter];
                break;
        }
        apply(value.value);
    }

    /**
     * Clones the animation value. Needed as structuredClone can only clone basic types.
     *
     * @param val Value to be cloned
     * @returns Cloned value
     */
    static cloneAnimationValue(val: AnimationValue) {
        if (typeof val === 'number') {
            return val;
        }
        return val.clone();
    }

    /**
     * Checks if both animation values are of the same type.
     *
     * @param a First animation value
     * @param b Second animation value
     */
    private static assertSameTypes(a: AnimationValue, b: AnimationValue) {
        if (typeof a !== typeof b) {
            throw new DifferentAnimationStepValueTypesError(
                `Different step types for animation: '${typeof a}' and '${typeof b}'`,
            );
        }
    }
}
