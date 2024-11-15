import { IllegalOperationError } from '../../../../errors/generic/illegal_operation_error';
import { Animatable } from '../animatable';
import { AnimationStep } from './animation_step';

export class FrameZeroAnimationStep<T extends Animatable> extends AnimationStep<T> {
    readonly stepType = 'current';

    get offset() {
        return 0;
    }

    offsetSeconds(_offset: number): this {
        throw new IllegalOperationError(`Trying to set animation offset on a frame zero step`);
    }
}
