import { Animatable } from './animatable';
import { Animation } from './animation';
import { AnimationStep } from './state/animation_step';
import { FrameZeroAnimationStep } from './state/frame_zero_animation_step';
import { FrameZeroCurrent } from './state/frame_zero_current';

export class AnimationBuilder<T extends Animatable> {
    private readonly _steps: AnimationStep<T>[] = [];

    constructor(
        readonly name: string,
        readonly target: T,
    ) {}

    startingAtCurrent() {
        const newStep = new FrameZeroCurrent<T>(
            this,
            step => this._steps.push(step),
            () => this.build(),
        );
        this._steps.push(newStep);
        return newStep;
    }

    startingAtAbsolute() {
        const newStep = new FrameZeroAnimationStep<T>(
            this,
            step => this._steps.push(step),
            () => this.build(),
        );
        this._steps.push(newStep);
        return newStep;
    }

    private build() {
        return new Animation<T>(this.name, this._steps);
    }
}
