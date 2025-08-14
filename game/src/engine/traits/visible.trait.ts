import type { Constructor } from 'typeUtils';

export interface Visible {
	get visible(): boolean;
	set visible(visible: boolean);
}

export function visible<T extends Constructor>(base: T): Constructor<Visible> & T {
	return class extends base {
		private _visible = true;

		get visible() {
			return this._visible;
		}

		set visible(v: boolean) {
			this._visible = v;
		}
	};
}
