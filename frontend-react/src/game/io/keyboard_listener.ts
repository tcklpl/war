import { Constructor } from "typeUtils";


export function keyboardListener<T extends Constructor>(base: T): Constructor & T {
    return class extends base {

        constructor(...args: any[]) {
            super(...args);
        }

        protected onKeyDown(key: string, fn: () => void) {
            game.io.keyboard.registerKeyListener(key, 'down', fn);
        }

        protected onKeyUp(key: string, fn: () => void) {
            game.io.keyboard.registerKeyListener(key, 'up', fn);
        }

    }
}
