import { Game } from "../game";

export class Mouse {

    x: number = -1;
    y: number = -1;

    private gl: WebGL2RenderingContext;

    private mouseMoveCallbacks: ((mouseX: number, mouseY: number) => void)[] = [];
    private mouseClickCallbacks: (() => void)[] = [];

    constructor() {
        this.gl = Game.instance.getGL();
        this.registerEvents();
    }

    private registerEvents() {

        this.gl.canvas.addEventListener('mousemove', e => {
            const rect = this.gl.canvas.getBoundingClientRect();
            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
            this.mouseMoveCallbacks.forEach(c => c(this.x, this.y));
        });

        this.gl.canvas.addEventListener('click', e => {
            this.mouseClickCallbacks.forEach(c => c());
        });
    }

    registerMouseMoveCallback(callback: (mouseX: number, mouseY: number) => void) {
        this.mouseMoveCallbacks.push(callback);
    }

    registerMouseClickCallback(callback: () => void) {
        this.mouseClickCallbacks.push(callback);
    }

    getPixelIdOnMouse(): number {
        const data = new Uint8Array(4);
        this.gl.readPixels(0, 0, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
        
        const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
        return id;
    }

}