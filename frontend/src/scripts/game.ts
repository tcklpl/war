import { AnimationManager } from "./engine/animations/animation_manager";
import { FPSCamera } from "./engine/camera/fps_camera";
import { Vec3 } from "./engine/data_formats/vec/vec3";
import { Engine } from "./engine/engine";
import { GameBoard } from "./game/game_board";
import { GameObjectHolder } from "./game/game_object_holder";
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
    private _board!: GameBoard;

    constructor(canvas: JQuery<HTMLElement>) {
        const webgl2context = (canvas.get(0) as HTMLCanvasElement).getContext("webgl2");
        if (!webgl2context) throw "Failed to acquire webgl2 context from canvas";

        Game.instance = this;
        this.glInstance = webgl2context;
        this.objHolder = new GameObjectHolder();
        this._mouse = new Mouse();

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
        this.mouse.registerMouseClickCallback(() => this.engine.interactions.notifyClick());
        this._board = new GameBoard();

        //let testCamera = new FPSCamera(new Vec3(-4, 10, 0), new Vec3(0, 1, 0), -80, 0);
        let testCamera = new FPSCamera(new Vec3(0, 10, 0), new Vec3(0, 1, 0), -80, 0);
        this.engine.cameras.registerCamera(testCamera);
        this.engine.cameras.setActiveCamera(testCamera);

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

    public get animations() {
        return this.animationManager;
    }

    public get board() {
        return this._board;
    }
}

export { Game }