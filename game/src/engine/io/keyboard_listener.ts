import { Constructor } from "typeUtils";

interface IKeyboardListener {
    onKeyDown(key: string, fn: () => void): void;
    onKeyUp(key: string, fn: () => void): void;
}

export function keyboardListener<T extends Constructor>(base: T): Constructor<IKeyboardListener> & T {
    return class extends base {

        protected onKeyDown(key: string, fn: () => void) {
            game.io.keyboard.registerKeyListener(key, 'down', fn);
        }

        protected onKeyUp(key: string, fn: () => void) {
            game.io.keyboard.registerKeyListener(key, 'up', fn);
        }

    }
}
