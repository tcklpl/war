import { Mouse } from "./mouse";

export class GameIO {

    private _mouse = new Mouse();

    get mouse() {
        return this._mouse;
    }

}