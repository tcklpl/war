import { IMouseListener } from "./mouse_listener";

export class Mouse {
    
    private _listeners: IMouseListener[] = [];

    private _x: number = -1;
    private _y: number = -1;

    private _scrollStopTimer: number = -1;
    private _mouseStopTimer: number = -1;

    constructor() {
        this.registerEvents();
    }

    registerListener(l: IMouseListener) {
        this._listeners.push(l);
    }

    private registerEvents() {

        // Movement
        gameCanvas.addEventListener('mousemove', e => {
            const rect = gameCanvas.getBoundingClientRect();
            this._x = e.clientX - rect.left;
            this._y = e.clientY - rect.top;

            this._listeners.forEach(l => {
                if (l.onMouseMove) l.onMouseMove(this._x, this._y);
                if (l.onMouseMoveOffset) l.onMouseMoveOffset(e.movementX, e.movementY);
            });

            if (this._mouseStopTimer !== -1) clearTimeout(this._mouseStopTimer);
            this._mouseStopTimer = setTimeout(() => this.triggerMouseStop(), 50);
        });

        // Left click
        gameCanvas.addEventListener('click', e => {
            this._listeners.forEach(l => {
                if (l.onMouseLeftClick) l.onMouseLeftClick();
            });
        });

        // Right click
        gameCanvas.addEventListener('contextmenu', e => {
            this._listeners.forEach(l => {
                if (l.onMouseRightClick) l.onMouseRightClick();
            });
        });

        // Scroll
        gameCanvas.addEventListener('wheel', e => {
            this._listeners.forEach(l => {
                if (l.onMouseScroll) l.onMouseScroll(e.deltaY);
                if (l.onMouseMoveOffset) l.onMouseMoveOffset(e.movementX, e.movementY);
            });

            if (this._scrollStopTimer !== -1) clearTimeout(this._scrollStopTimer);
            this._scrollStopTimer = setTimeout(() => this.triggerMouseScrollStop(), 300);
        });
    }

    private triggerMouseStop() {
        this._mouseStopTimer = -1;
        this._listeners.forEach(l => {
            if (l.onMouseStop) l.onMouseStop();
        });
    }

    private triggerMouseScrollStop() {
        this._scrollStopTimer = -1;
        this._listeners.forEach(l => {
            if (l.onMouseScrollStop) l.onMouseScrollStop();
        });
    }

}


