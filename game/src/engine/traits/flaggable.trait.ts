import type { EntityFlag } from ':engine/data/entity/entity-flag';
import type { Constructor } from 'typeUtils';

export interface Flaggable {
	hasFlag(flag: EntityFlag): boolean;
	addFlag(flag: EntityFlag): void;
	removeFlag(flag: EntityFlag): void;
	switchFlag(flag: EntityFlag): void;
}

export function flaggable<T extends Constructor>(base: T): Constructor<Flaggable> & T {
	return class extends base {
		private readonly _flags = new Set<EntityFlag>();

		hasFlag(flag: EntityFlag) {
			return this._flags.has(flag);
		}

		addFlag(flag: EntityFlag) {
			this._flags.add(flag);
		}

		removeFlag(flag: EntityFlag) {
			this._flags.delete(flag);
		}

		switchFlag(flag: EntityFlag) {
			if (this.hasFlag(flag)) this.removeFlag(flag);
			else this.addFlag(flag);
		}
	};
}
