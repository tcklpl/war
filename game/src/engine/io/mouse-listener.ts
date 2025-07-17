import type { Constructor } from 'typeUtils';
import type { Vec2 } from '../data/vec/vec2';

export interface IMouseListener {
	onMouseMove?(position: Vec2): void;
	onMouseMoveOffset?(offset: Vec2): void;
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
			game.engine.managers.io.mouse.registerListener(this);
		}
	};
}
