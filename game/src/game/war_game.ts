import { Engine } from '../engine/engine';
import { GameBoard } from './board/board';
import { GameStateManager } from './game_state_manager';
import { GameLoader } from './loader/game_loader';

export class WarGame {
    private _loader = new GameLoader();
    private _engine = new Engine();
    private _state = GameStateManager.INSTANCE;

    private _gameBoard!: GameBoard;
    private _toRunWhenReady: (() => void)[] = [];
    private _ready = false;

    static initialize() {
        globalThis.game = new WarGame();
        game.loader.load();
        return game;
    }

    async initializeGame() {
        await this._state.initialize();

        this._gameBoard = new GameBoard();
        await this._gameBoard.initialize();
        this._engine.managers.scene.register(this._gameBoard);
        this._engine.managers.scene.activeScene = this._gameBoard;

        this._ready = true;
        this._toRunWhenReady.forEach(runnable => runnable());
        this._toRunWhenReady = [];
    }

    async kill() {
        // free all engine gpu memory
        await this._engine.free();
    }

    runWhenReady(runnable: () => void) {
        if (this._ready) {
            runnable();
        } else {
            this._toRunWhenReady.push(runnable);
        }
    }

    get loader() {
        return this._loader;
    }

    get engine() {
        return this._engine;
    }

    get state() {
        return this._state;
    }
}
