import type { IDBConnector } from '../../idb/idb-connector';
import { IDBController } from '../../idb/idb-controller';
import type { CachedAsset } from './cached-asset';
import type { CachedAssetIDBInterface } from './cached-asset-idb-interface';
import type { CachedAssetKey } from './cached-asset-key';

export class AssetCache extends IDBController<CachedAssetIDBInterface> {
	constructor(connection: IDBConnector) {
		super(connection, {
			name: 'asset-cache',
			keyPath: 'name',
		});
	}

	async getAsset(key: CachedAssetKey) {
		return await this.getOne(key.keyedName);
	}

	async putAsset(asset: CachedAsset) {
		return await this.add(asset.cachedAssetInterface);
	}
}
