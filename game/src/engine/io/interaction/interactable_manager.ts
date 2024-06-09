import { IIdentifiable } from '../../data/traits/identifiable';
import { IInteractable } from '../../data/traits/interactable';

export class InteractableManager {
    private _interactables: Map<number, IInteractable> = new Map();

    registerInteractable(i: IInteractable & IIdentifiable) {
        this._interactables.set(i.id, i);
    }

    unregisterInteractable(i: IInteractable & IIdentifiable) {
        return this._interactables.delete(i.id);
    }

    get(id: number) {
        return this._interactables.get(id);
    }
}
