import { IDBConnector } from "../../idb/idb_connector";
import { IDBController } from "../../idb/idb_controller";
import { CachedAsset } from "./cached_asset";
import { CachedAssetIDBInterface } from "./cached_asset_idb_interface";
import { CachedAssetKey } from "./cached_asset_key";

export class AssetCache extends IDBController<CachedAssetIDBInterface> {

    constructor(connection: IDBConnector) {
        super(connection, {
            name: 'asset-cache',
            keyPath: 'name'
        });
    }

    async getAsset(key: CachedAssetKey) {
        return await this.getOne(key.keyedName);
    }

    async putAsset(asset: CachedAsset) {
        return await this.add(asset.cachedAssetInterface);
    }

}