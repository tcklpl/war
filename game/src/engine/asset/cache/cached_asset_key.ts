import { AssetType } from "./asset_type";

export class CachedAssetKey {

    constructor(private _type: AssetType, private _name: string) { }

    get keyedName() {
        return `${this._type}-${this._name}`;
    }

}