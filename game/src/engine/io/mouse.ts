import { Vec2 } from '../data/vec/vec2';
import { IMouseListener } from './mouse_listener';

export class Mouse {
    private readonly _listeners: IMouseListener[] = [];
    private readonly _position = new Vec2(0, 0);

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
            this._position.x = e.clientX - rect.left;
            this._position.y = e.clientY - rect.top;

            this._listeners.forEach(l => {
                if (l.onMouseMove) l.onMouseMove(this._position);
                if (l.onMouseMoveOffset) l.onMouseMoveOffset(new Vec2(e.movementX, e.movementY));
            });

            if (this._mouseStopTimer !== -1) clearTimeout(this._mouseStopTimer);
            this._mouseStopTimer = window.setTimeout(() => this.triggerMouseStop(), 50);
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
            });

            if (this._scrollStopTimer !== -1) clearTimeout(this._scrollStopTimer);
            this._scrollStopTimer = window.setTimeout(() => this.triggerMouseScrollStop(), 300);
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

    get position() {
        return this._position;
    }
}
