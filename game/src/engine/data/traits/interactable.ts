import { Constructor } from 'typeUtils';
import { IIdentifiable } from './identifiable';

export interface IInteractable {
    onMouseHover?(): void;
    onMouseLeave?(): void;
    onMouseLeftClick?(): void;
    onMouseRightClick?(): void;

    unregisterInteractions(): void;
}

export function interactable<T extends Constructor<IIdentifiable>>(base: T): Constructor<IInteractable> & T {
    return class extends base {
        constructor(...args: any[]) {
            super(...args);
            game.engine.managers.io.interactionManager.registerInteractable(this);
        }

        unregisterInteractions() {
            game.engine.managers.io.interactionManager.unregisterInteractable(this);
        }
    };
}
