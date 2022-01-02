import { Game } from "../game";
import { Camera } from "./camera/camera";
import { CameraManager } from "./camera/camera_manager";
import { FPSCamera } from "./camera/fps_camera";
import { Vec3 } from "./data_formats/vec/vec3";
import { Renderer } from "./rederer";
import { ShaderManager } from "./shader_manager";

export class Engine {

    private gl: WebGL2RenderingContext;
    private renderer!: Renderer;
    private shaderManager: ShaderManager = new ShaderManager();
    private cameraManager: CameraManager = new CameraManager();

    deltaTime: number = 0;
    private lastFrame: number = 0;

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

    test() {
        this.renderer = new Renderer(this.gl);
        this.adjustToWindowSize();

        let testCamera = new FPSCamera(new Vec3(-4, 10, 0), new Vec3(0, 1, 0), -80, 0);
        this.cameraManager.registerCamera(testCamera);
        this.cameraManager.setActiveCamera(testCamera);

        Game.instance.getObjectHolder().allObjects.forEach(x => this.renderer.addVisible(x));
        requestAnimationFrame((t) => this.draw(t));
    }

    draw(time: number) {
        // defining deltaTime, here time is defined as ms, we need to divide by 1000 to be as seconds
        this.deltaTime = (time - this.lastFrame) / 1000;
        this.lastFrame = time;

        $('#test').html(`FPS: ${(1 / this.deltaTime).toFixed(2)}`);

        // draw here
        this.renderer.render();

        requestAnimationFrame((t) => this.draw(t));
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

}