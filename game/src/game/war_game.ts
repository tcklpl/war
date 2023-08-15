import { Engine } from "../engine/engine";
import { GameBoard } from "./board/board";
import { GameIO } from "./io/io";

export class WarGame {

    private _engine = new Engine();
    private _io = new GameIO();

    private _gameBoard!: GameBoard;

    private constructor() {
        this._engine.managers.asset.loadAssets().then(() => this.initializeGame());
    }

    static initialize() {
        globalThis.game = new WarGame();
    }

    private initializeGame() {
        this._gameBoard = new GameBoard();
        this._engine.managers.scene.register(this._gameBoard);
        this._engine.managers.scene.activeScene = this._gameBoard;

        this._engine.resumeRender();
    }

    kill() {
        // free all engine gpu memory
        this._engine.free();
    }

    get engine() {
        return this._engine;
    }

    get io() {
        return this._io;
    }

}