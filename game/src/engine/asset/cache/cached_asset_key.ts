import { AssetType } from './asset_type';

export class CachedAssetKey {
    constructor(
        private readonly _type: AssetType,
        private readonly _name: string,
    ) {}

    get keyedName() {
        return `${this._type}-${this._name}`;
    }
}
