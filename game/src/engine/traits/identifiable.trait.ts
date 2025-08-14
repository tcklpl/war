import type { Constructor } from 'typeUtils';

export interface IIdentifiable {
	get id(): number;

	writeIdToBuffer(buffer: GPUBuffer, offset: number): void;
}

export function identifiable<T extends Constructor>(base: T): Constructor<IIdentifiable> & T {
	return class extends base {
		private readonly _id: number;
		private readonly _idUint32: Uint32Array<ArrayBuffer>;

		constructor(...args: any[]) {
			super(...args);
			this._id = game.engine.idPool.requestID(this);
			this._idUint32 = new Uint32Array([this._id]);
		}

		writeIdToBuffer(buffer: GPUBuffer, offset: number) {
			device.queue.writeBuffer(buffer, offset, this._idUint32);
		}

		get id() {
			return this._id;
		}
	};
}
