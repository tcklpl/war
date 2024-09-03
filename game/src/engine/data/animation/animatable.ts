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
        setters: {
            [key: string]: (...args: any[]) => void;
        };
    };
}

export interface EncodedAnimationTarget {
    target: string;
    value: any;
    type: 'setter' | 'incrementor';
    setter: string;
    interpolation: AnimationInterpolation;
}

export type AnimationInterpolation = 'step' | 'linear';
