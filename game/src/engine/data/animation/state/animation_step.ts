import { DuplicateAnimationDeltasError } from '../../../../errors/engine/data/animation/duplicate_animation_deltas';
import { Animatable, EncodedAnimationTarget } from '../animatable';
import { Animation } from '../animation';
import { AnimationBuilder } from '../animation_builder';

export class AnimationStep<T extends Animatable> {
    private _offset = 0;
    private _deltas: EncodedAnimationTarget[] = [];
    readonly stepType: 'custom' | 'current' = 'custom';

    constructor(
        private readonly _parentAnimationBuilder: AnimationBuilder<T>,
        private readonly _registerNewStep: (step: AnimationStep<T>) => void,
        private readonly _buildAnimation: () => Animation<T>,
    ) {}

    get offset() {
        return this._offset;
    }

    get deltas() {
        return this._deltas;
    }

    do(deltaDefinition: (encoders: T['animationStrings']['encoders']) => EncodedAnimationTarget[]) {
        const newDeltas = deltaDefinition(this._parentAnimationBuilder.target.animationStrings.encoders);
        if (!this.validateDeltas(newDeltas))
            throw new DuplicateAnimationDeltasError(
                `Trying to define duplicate deltas on animation ${this._parentAnimationBuilder.name}`,
            );
        this._deltas = [
            ...this._deltas,
            ...deltaDefinition(this._parentAnimationBuilder.target.animationStrings.encoders),
        ];
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
        const nextStep = new AnimationStep<T>(
            this._parentAnimationBuilder,
            this._registerNewStep,
            this._buildAnimation,
        );
        this._registerNewStep(nextStep);
        return nextStep;
    }

    build() {
        return this._buildAnimation();
    }
}
