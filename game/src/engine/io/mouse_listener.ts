import { Constructor } from "typeUtils";

export interface IMouseListener {
    
    onMouseMove?(x: number, y: number): void;
    onMouseMoveOffset?(movementX: number, movementY: number): void;
    onMouseStop?(): void;

    onMouseLeftClick?(): void;
    onMouseRightClick?(): void;

    onMouseScroll?(dy: number): void;
    onMouseScrollStop?(): void;
}

export function mouseListener<T extends Constructor>(base: T): Constructor<IMouseListener> & T {
    return class extends base {

        constructor(...args: any[]) {
            super(...args);
            game.io.mouse.registerListener(this);
        }

    }
}
