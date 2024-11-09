import { AnimationBuilder } from '../../../engine/data/animation/animation_builder';
import { Vec3 } from '../../../engine/data/vec/vec3';
import { BoardCountry } from '../board_country';

export const BoardCountryAnimationHoverOn = (country: BoardCountry) =>
    new AnimationBuilder('board hover on', country)
        .startingAtCurrent()
        .nextStep()
        .offsetSeconds(0.2)
        .do(e => [e.translate(new Vec3(0, 0.1, 0))])
        .build();

export const BoardCountryAnimationResetPosition = (country: BoardCountry, position: Vec3) =>
    new AnimationBuilder('board reset position', country)
        .startingAtCurrent()
        .nextStep()
        .offsetSeconds(0.2)
        .do(e => [e.setTranslation(position)])
        .build();
