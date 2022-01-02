import { Engine } from "./engine/engine";
import { GameObjectHolder } from "./game/game_object_holder";
import { Mouse } from "./game/mouse";
import { UILoading } from "./game/ui/ui_loading";
import { Loader } from "./loader"

class Game {

    static instance: Game;

    private loader: Loader = new Loader();
    private engine!: Engine;
    private glInstance: WebGL2RenderingContext;
    private objHolder: GameObjectHolder;
    private _mouse: Mouse;

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
        this.engine = new Engine(webgl2context);
        this.loader.postConstruct();
        UILoading.buffersInitialized();
        this.engine.test();
    }

    resizeWindowCallback() {
        
    }

    getLoader(): Loader {
        return this.loader;
    }

    getEngine(): Engine {
        return this.engine;
    }

    getGL(): WebGL2RenderingContext {
        return this.glInstance;
    }

    getObjectHolder(): GameObjectHolder {
        return this.objHolder;
    }

    public get mouse() {
        return this._mouse;
    }
}

export { Game }