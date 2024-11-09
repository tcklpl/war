import { BoardSun } from './lights/board_sun';

export class BoardLights {
    private readonly _sun = new BoardSun();

    get sun() {
        return this._sun;
    }
}
