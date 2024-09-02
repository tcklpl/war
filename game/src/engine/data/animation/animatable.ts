/**
 * Interface for animatable stuff.
 *
 * Each object that wants to be animates should implement its own animation targets and logic.
 * I believe that it would be cleaner this way. Obviously translation, rotation and scale will be
 * already implemented by base classes such as MatrixTransformative.
 *
 * ! Encoders and setters NEED to match names.
 */
export interface Animatable {
    animation: {
        encoders: {
            [key: string]: (...args: any[]) => EncodedAnimationTarget;
        };
        setters: {
            [key: string]: (...args: any[]) => void;
        };
    };
}

export interface EncodedAnimationTarget {
    target: string;
    value: any;
}
