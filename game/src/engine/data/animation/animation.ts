import { Animatable } from './animatable';
import { AnimationStep } from './state/animation_step';
import { FrameZeroAnimationStep } from './state/frame_zero_animation_step';

export class Animation<T extends Animatable> {
    private _steps: AnimationStep<T>[] = [];

    constructor(
        readonly name: string,
        readonly target: T,
    ) {}

    startingAtCurrent() {
        const newStep = new FrameZeroAnimationStep<T>(
            this,
            step => this._steps.push(step),
            () => this.build(),
        );
        this._steps.push(newStep);
        return newStep;
    }

    startingAtAbsolute() {
        // TODO: start
    }

    private build() {
        return this;
    }
}
