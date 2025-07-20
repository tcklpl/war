import type { Constructor } from 'typeUtils';

export interface IIdentifiable {
	get id(): number;
	get idUint32(): Uint32Array;
}

export function identifiable<T extends Constructor>(base: T): Constructor<IIdentifiable> & T {
	return class extends base {
		private readonly _id: number;
		private readonly _idUint32: Uint32Array;

		constructor(...args: any[]) {
			super(...args);
			this._id = game.engine.idPool.requestID(this);
			this._idUint32 = new Uint32Array([this._id]);
		}

		get id() {
			return this._id;
		}

		get idUint32() {
			return this._idUint32;
		}
	};
}
