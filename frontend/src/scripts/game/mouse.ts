import { IMouseListener } from "../engine/traits/mouse_listener";
import { Game } from "../game";

export class Mouse {

    x: number = -1;
    y: number = -1;

    private gl: WebGL2RenderingContext;
    private mouseListeners: IMouseListener[] = [];

    private scrollStopTimer: number = -1;

    constructor() {
        this.gl = Game.instance.getGL();
        this.registerEvents();
    }

    private registerEvents() {

        this.gl.canvas.addEventListener('mousemove', e => {
            const rect = this.gl.canvas.getBoundingClientRect();
            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
            this.mouseListeners.forEach(c => {
                if (c.onMouseMove) c.onMouseMove(this.x, this.y);
            });
        });

        this.gl.canvas.addEventListener('click', e => {
            this.mouseListeners.forEach(c => {
                if (c.onMouseLeftClick) c.onMouseLeftClick();
            });
        });

        this.gl.canvas.addEventListener('wheel', e => {
            this.mouseListeners.forEach(c => {
                if (c.onMouseScroll) c.onMouseScroll(e.deltaY);
            });
            if (this.scrollStopTimer != -1) clearTimeout(this.scrollStopTimer)
            this.scrollStopTimer = setTimeout(() => this.triggerMouseScrollStop(), 300);
        });
    }

    private triggerMouseScrollStop() {
        this.scrollStopTimer = -1;
        this.mouseListeners.forEach(c => {
            if (c.onMouseScrollStop) c.onMouseScrollStop();
        });
    }

    registerMouseListener(listener: IMouseListener) {
        this.mouseListeners.push(listener);
    }

    getPixelIdOnMouse(): number {
        const data = new Uint8Array(4);
        this.gl.readPixels(0, 0, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
        
        const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
        return id;
    }

}