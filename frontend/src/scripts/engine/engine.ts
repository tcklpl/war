import { Game } from "../game";
import { CameraManager } from "./camera/camera_manager";
import { ObjectInteractionManager } from "./obj_interaction_manager";
import { Renderer } from "./rederer";
import { ShaderManager } from "./shader_manager";
import { ITimeSensitive } from "./traits/time_sensitive";

export class Engine {

    private gl: WebGL2RenderingContext;
    private _renderer!: Renderer;
    private shaderManager: ShaderManager = new ShaderManager();
    private cameraManager: CameraManager = new CameraManager();
    private objInteractionManager: ObjectInteractionManager = new ObjectInteractionManager();

    private _deltaTime: number = 0;
    private lastFrame: number = 0;
    private preDrawListeners: ITimeSensitive[] = [];


    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;

        gl.clearColor(0, 0, 0, 1);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.depthFunc(gl.LESS);
    }
    
    adjustToWindowSize() {
        this.gl.canvas.width = this.gl.canvas.clientWidth;
        this.gl.canvas.height = this.gl.canvas.clientHeight;
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.renderer.resize(this.gl.canvas.width, this.gl.canvas.height);
    }

    finalizeSetup() {
        this._renderer = new Renderer(this.gl);
        this.adjustToWindowSize();

        requestAnimationFrame((t) => this.draw(t));
    }

    draw(time: number) {
        // defining deltaTime, here time is defined as ms, we need to divide by 1000 to be as seconds
        let msDiff = (time - this.lastFrame);
        this._deltaTime = msDiff / 1000;
        this.lastFrame = time;

        $('#test').html(`FPS: ${(1 / this._deltaTime).toFixed(2)}`);
        this.preDrawListeners.forEach(l => l.update(this._deltaTime));

        // draw here
        Game.instance.animations.animate(msDiff);
        this.renderer.render();

        requestAnimationFrame((t) => this.draw(t));
    }

    registerPreDrawListener(listener: ITimeSensitive) {
        this.preDrawListeners.push(listener);
    }

    getWebGL(): WebGL2RenderingContext {
        return this.gl;
    }

    public get shaders(): ShaderManager {
        return this.shaderManager;
    }

    public get cameras(): CameraManager {
        return this.cameraManager;
    }

    public get interactions(): ObjectInteractionManager {
        return this.objInteractionManager;
    }

    public get renderer() {
        return this._renderer;
    }

    public get deltaTime() {
        return this._deltaTime;
    }

}