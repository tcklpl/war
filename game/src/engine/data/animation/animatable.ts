import { Quaternion } from '../quaternion/quaternion';
import { Vec3 } from '../vec/vec3';

export type AnimationValue = number | Vec3 | Quaternion;
export type AnimationInterpolation = 'step' | 'linear';

/**
 * Interface for animatable stuff.
 *
 * Each object that wants to be animates should implement its own animation targets and logic.
 * I believe that it would be cleaner this way. Obviously translation, rotation and scale will be
 * already implemented by base classes such as MatrixTransformative.
 */
export interface Animatable {
    animation: {
        encoders: {
            [key: string]: (value: any, interpolation?: AnimationInterpolation) => EncodedAnimationTarget;
        };
        getters: {
            [key: string]: () => any;
        };
        setters: {
            [key: string]: (value: any) => void;
        };
        accumulators: {
            [key: string]: (value: any) => void;
        };
    };
}

export interface EncodedAnimationTarget {
    target: string;
    value: AnimationValue;
    type: 'setter' | 'incrementor';
    getter: string;
    setter: string;
    interpolation: AnimationInterpolation;
}
