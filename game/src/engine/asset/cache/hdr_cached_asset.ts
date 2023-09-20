import { CachedAssetKey } from "./cached_asset_key";
import { CachedAsset } from "./cached_asset";
import { HDRImageData } from "../loaders/hdr_loader";

export class HDRCachedAsset extends CachedAsset {

    constructor(key: CachedAssetKey, data: HDRImageData) { 
        super(key, data);
    }

}