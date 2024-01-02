import { CachedAssetIDBInterface } from "./cached_asset_idb_interface";
import { CachedAssetKey } from "./cached_asset_key";

export class CachedAsset {

    constructor(private _key: CachedAssetKey, private _data: any) { }

    get name() {
        return this._key.keyedName;
    }

    get data() {
        return this._data;
    }

    get cachedAssetInterface() {
        return {
            name: this.name,
            data: this._data
        } as CachedAssetIDBInterface
    }

}