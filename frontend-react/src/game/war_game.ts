import { Engine } from "../engine/engine";
import { WarGameLoader } from "./loading/game_loader";

export class WarGame {

    private _loader = new WarGameLoader();
    private _engine = new Engine();

    private constructor() {this._loader.loadGLTFAssets()}

    static initialize() {
        globalThis.game = new WarGame();
    }

    get engine() {
        return this._engine;
    }

}