import { LoadStage } from "./load_stage";

export class GameLoader {

    private _loadStage = LoadStage.STARTING;

    async load() {
        this.loadStage = LoadStage.INITIALIZING_ENGINE;
        await this.initializeEngine();

        this.loadStage = LoadStage.LOADING_ASSETS;
        await this.loadAssets();

        this.loadStage = LoadStage.INITIALIZING_GAME;
        await this.initializeGame();

        this.loadStage = LoadStage.COMPLETE;
    }

    private async initializeEngine() {
        await game.engine.initializeRenderers();
    }

    private async loadAssets() {
        await game.engine.managers.asset.loadAssets();
    }

    private async initializeGame() {
        await game.initializeGame();
    }

    private set loadStage(s: LoadStage) {
        this._loadStage = s;
    }

    get loadStage() {
        return this._loadStage;
    }
}