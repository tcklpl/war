import type { CachedAssetIDBInterface } from './cached-asset-idb-interface';
import type { CachedAssetKey } from './cached-asset-key';

export class CachedAsset {
	constructor(
		private readonly _key: CachedAssetKey,
		private readonly _data: any,
	) {}

	get name() {
		return this._key.keyedName;
	}

	get data() {
		return this._data;
	}

	get cachedAssetInterface() {
		return {
			name: this.name,
			data: this._data,
		} as CachedAssetIDBInterface;
	}
}
