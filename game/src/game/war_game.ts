import { Engine } from "../engine/engine";
import { GameBoard } from "./board/board";
import { GameLoader } from "./loader/game_loader";

export class WarGame {

    private _loader = new GameLoader();
    private _engine = new Engine();

    private _gameBoard!: GameBoard;

    static initialize() {
        globalThis.game = new WarGame();
        game.loader.load();
        return game;
    }

    async initializeGame() {
        this._gameBoard = new GameBoard();
        await this._gameBoard.initialize();
        this._engine.managers.scene.register(this._gameBoard);
        this._engine.managers.scene.activeScene = this._gameBoard;

        this._engine.resumeRender();
    }

    kill() {
        // free all engine gpu memory
        this._engine.free();
    }

    get loader() {
        return this._loader;
    }

    get engine() {
        return this._engine;
    }

}