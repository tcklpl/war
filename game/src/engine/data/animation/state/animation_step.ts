import { DuplicateAnimationDeltasError } from '../../../../errors/engine/data/animation/duplicate_animation_deltas';
import { Animatable, EncodedAnimationTarget } from '../animatable';
import { Animation } from '../animation';

export class AnimationStep<T extends Animatable> {
    private _offset = 0;
    private _deltas: EncodedAnimationTarget[] = [];

    constructor(
        private _parentAnimation: Animation<T>,
        private _registerNewStep: (step: AnimationStep<T>) => void,
        private _buildAnimation: () => Animation<T>,
    ) {}

    get offset() {
        return this._offset;
    }

    do(deltaDefinition: (encoders: any) => EncodedAnimationTarget[]) {
        const newDeltas = deltaDefinition(this._parentAnimation.target.animation.encoders);
        if (!this.validateDeltas(newDeltas))
            throw new DuplicateAnimationDeltasError(
                `Trying to define duplicate deltas on animation ${this._parentAnimation.name}`,
            );
        this._deltas = [...this._deltas, ...deltaDefinition(this._parentAnimation.target.animation.encoders)];
        return this;
    }

    private validateDeltas(newDeltas: EncodedAnimationTarget[]) {
        if (newDeltas.some(d => this._deltas.some(x => d.target === x.target))) return false;
        return true;
    }

    offsetSeconds(offset: number) {
        this._offset = offset;
        return this;
    }

    nextStep() {
        const nextStep = new AnimationStep<T>(this._parentAnimation, this._registerNewStep, this._buildAnimation);
        this._registerNewStep(nextStep);
        return nextStep;
    }

    build() {
        return this._buildAnimation();
    }
}
