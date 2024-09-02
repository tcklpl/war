import { Animation } from '../../../engine/data/animation/animation';
import { Vec3 } from '../../../engine/data/vec/vec3';
import { BoardCountry } from '../board_country';

export const BoardCountryAnimationHoverOn = (country: BoardCountry) =>
    new Animation('board hover on', country)
        .startingAtCurrent()
        .nextStep()
        .offsetSeconds(0.2)
        .do(e => [e.translate(new Vec3(0, 0.1, 0))])
        .build();
