import type { IIdentifiable } from '../../traits/identifiable.trait';
import type { IInteractable } from '../../traits/interactable.trait';

export class InteractableManager {
	private readonly _interactables: Map<number, IInteractable> = new Map();

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
