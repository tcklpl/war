import type { Constructor } from 'typeUtils';

export interface IFrameListener {
	onEachFrame?(deltaTime: number): void;
	onEachSecond?(): void;
}

export function frameListener<T extends Constructor>(base: T): Constructor<IFrameListener> & T {
	return class extends base {
		constructor(...args: any[]) {
			super(...args);
			game.engine.registerFrameListener(this);
		}
	};
}
