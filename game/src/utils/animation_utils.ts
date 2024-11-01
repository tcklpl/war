import { AnimationValue } from '../engine/data/animation/animatable';
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
    static interpolateValueLinear(a: AnimationValue, b: AnimationValue, factor: number) {
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
     * Adds increment to the source and returns the result, checking if both are of the same type.
     *
     * @param source Base value
     * @param increment Incrementor value
     * @returns Sum of the two values
     */
    static incrementAnimationValue(source: AnimationValue, increment: AnimationValue) {
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
