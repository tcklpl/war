import { AnimationManager } from "./engine/animations/animation_manager";
import { Engine } from "./engine/engine";
import { GameBoard } from "./game/game_board";
import { GameCamera } from "./game/game_camera";
import { GameObjectHolder } from "./game/game_object_holder";
import { Keyboard } from "./game/keyboard";
import { Mouse } from "./game/mouse";
import { UILoading } from "./game/ui/ui_loading";
import { Loader } from "./loader"

class Game {

    static instance: Game;

    private _loader: Loader = new Loader();
    private _engine!: Engine;
    private glInstance: WebGL2RenderingContext;
    private objHolder: GameObjectHolder;
    private animationManager: AnimationManager = new AnimationManager();
    private _mouse: Mouse;
    private _keyboard: Keyboard;
    private _board!: GameBoard;
    private _mainCamera!: GameCamera;

    constructor(canvas: JQuery<HTMLElement>) {
        const webgl2context = (canvas.get(0) as HTMLCanvasElement).getContext("webgl2");
        if (!webgl2context) throw "Failed to acquire webgl2 context from canvas";

        Game.instance = this;
        this.glInstance = webgl2context;
        this.objHolder = new GameObjectHolder();
        this._mouse = new Mouse();
        this._keyboard = new Keyboard();

        // Load before creating stuff
        this.loader.loadStateChangedCallback = UILoading.loadingStateChanged;
        this.loader.loadFailedCallback = UILoading.loadFailed;
        this.loader.loadFinishedCallback = () => {
            UILoading.ajaxLoadFinished();
            this.loadFinished(webgl2context);
        };
        this.loader.load();

    }

    private loadFinished(webgl2context: WebGL2RenderingContext) {
        this._engine = new Engine(webgl2context);
        this.loader.postConstruct();
        UILoading.buffersInitialized();
        this.engine.finalizeSetup();
        this._board = new GameBoard();

        this._mainCamera = new GameCamera();
        this.engine.cameras.registerCamera(this._mainCamera);
        this.engine.cameras.setActiveCamera(this._mainCamera);
    }

    public get loader(): Loader {
        return this._loader;
    }

    public get engine(): Engine {
        return this._engine;
    }

    getGL(): WebGL2RenderingContext {
        return this.glInstance;
    }

    public get objectHolder(): GameObjectHolder {
        return this.objHolder;
    }

    public get mouse() {
        return this._mouse;
    }

    public get keyboard() {
        return this._keyboard;
    }

    public get animations() {
        return this.animationManager;
    }

    public get board() {
        return this._board;
    }

    public get mainCamera() {
        return this._mainCamera;
    }
}

export { Game }