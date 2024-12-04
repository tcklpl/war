import { Engine } from ':engine/engine';
import { GameBoard } from './board/board';
import { EventManager } from './event/event_manager';
import { GameStateManager } from './game_state_manager';
import { GameLoader } from './loader/game_loader';

export class WarGame {
    readonly loader = new GameLoader();
    readonly engine = new Engine();
    readonly state = GameStateManager.INSTANCE;
    readonly events = new EventManager();

    private _gameBoard!: GameBoard;
    private _toRunWhenReady: (() => void)[] = [];
    private _ready = false;

    static initialize() {
        globalThis.game = new WarGame();
        game.loader.load();
        return game;
    }

    async initializeGame() {
        await this.state.initialize();

        this._gameBoard = new GameBoard();
        await this._gameBoard.initialize();
        this.engine.managers.scene.register(this._gameBoard);
        this.engine.managers.scene.activeScene = this._gameBoard;

        this._ready = true;
        this._toRunWhenReady.forEach(runnable => runnable());
        this._toRunWhenReady = [];
    }

    async kill() {
        // free all engine gpu memory
        await this.engine.free();
    }

    runWhenReady(runnable: () => void) {
        if (this._ready) {
            runnable();
        } else {
            this._toRunWhenReady.push(runnable);
        }
    }
}
