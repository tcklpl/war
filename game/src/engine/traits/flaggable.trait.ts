import type { EntityFlag } from ':engine/data/entity/entity-flag';
import type { Constructor } from 'typeUtils';

export interface Flaggable {
	hasFlag(flag: EntityFlag): boolean;
	addFlag(flag: EntityFlag): void;
	removeFlag(flag: EntityFlag): void;
	switchFlag(flag: EntityFlag): void;

	registerFlaggableBuffer(buffer: GPUBuffer, offset: number): void;
}

export function flaggable<T extends Constructor>(base: T): Constructor<Flaggable> & T {
	return class extends base {
		private readonly _flags = new Set<EntityFlag>();
		private readonly _flagsU32 = new Uint32Array(1);

		private _flaggableBuffer?: GPUBuffer;
		private _flaggableBufferOffset?: number;

		hasFlag(flag: EntityFlag) {
			return this._flags.has(flag);
		}

		addFlag(flag: EntityFlag) {
			this._flags.add(flag);
			this.updateFlagsOnBuffer();
		}

		removeFlag(flag: EntityFlag) {
			this._flags.delete(flag);
			this.updateFlagsOnBuffer();
		}

		switchFlag(flag: EntityFlag) {
			if (this.hasFlag(flag)) this.removeFlag(flag);
			else this.addFlag(flag);
			this.updateFlagsOnBuffer();
		}

		registerFlaggableBuffer(buffer: GPUBuffer, offset: number) {
			this._flaggableBuffer = buffer;
			this._flaggableBufferOffset = offset;
		}

		private updateFlagsOnBuffer() {
			if (!this._flaggableBuffer || !this._flaggableBufferOffset) return;
			const newFlagValue = [...this._flags].reduce((prev, cur) => prev | cur, 0);
			this._flagsU32[0] = newFlagValue;
			device.queue.writeBuffer(this._flaggableBuffer, this._flaggableBufferOffset, this._flagsU32);
		}
	};
}
