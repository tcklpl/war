import type { Mouse } from '../mouse';

export class MouseInteractionManager {
	constructor(private readonly _mouse: Mouse) {
		_mouse.registerListener(this);
	}

	private _currentHoverID = 0;

	notifyFramePickingID(id: number) {
		if (id === this._currentHoverID) return;

		const old = this.currentHovered;
		if (old?.onMouseLeave) old.onMouseLeave();

		this._currentHoverID = id;

		const current = this.currentHovered;
		if (current?.onMouseHover) current.onMouseHover();
	}

	onMouseLeftClick() {
		const current = this.currentHovered;
		if (current?.onMouseLeftClick) current.onMouseLeftClick();
	}

	onMouseRightClick() {
		const current = this.currentHovered;
		if (current?.onMouseRightClick) current.onMouseRightClick();
	}

	get currentHovered() {
		return game.engine.managers.io.interactionManager.get(this._currentHoverID);
	}
}
