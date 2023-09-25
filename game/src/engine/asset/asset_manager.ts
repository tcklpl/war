import { Manager } from "../manager";
import { Asset } from "./asset";
import assetIndex from "../../asset_index.json";
import { MissingAssetError } from "../../errors/engine/asset/missing_asset";
import { GLTFAsset } from "./gltf_asset";
import { GLTFLoader } from "./loaders/gltf_loader";
import { GLTFFile } from "../data/gltf/gltf_file";
import { BadGLTFFileError } from "../../errors/engine/gltf/bad_gltf_file";
import { IMGAsset } from "./img_asset";
import { HDRImageData, HDRLoader } from "./loaders/hdr_loader";
import { HDRAsset } from "./hdr_asset";
import { AssetCache } from "./cache/asset_cache";
import { IDBConnector } from "../idb/idb_connector";
import { CachedAssetKey } from "./cache/cached_asset_key";
import { AssetType } from "./cache/asset_type";
import { HDRCachedAsset } from "./cache/hdr_cached_asset";

type AssetIndex = typeof assetIndex;
type GLTFAssetName = keyof AssetIndex["gltf"];
type IMGAssetName = keyof AssetIndex["img"];
type HDRAssetName = keyof AssetIndex["hdr"];
type AddressableAsset = { url: string };

export class AssetManager extends Manager<Asset> {

    private loaders = {
        gltf: new GLTFLoader(),
        hdr: new HDRLoader()
    }

    private _cache!: AssetCache;

    async initializeDB(connection: IDBConnector) {
        this._cache = new AssetCache(connection);

        // clear the cache if the user doesn't want to cache assets
        if (!game.engine.config.game.cacheAssets) {
            this._cache.clear();
        }
    }

    async loadAssets(onAssetLoadCallback?: () => void) {
        await this.loadGLTFAssets(onAssetLoadCallback);
        await this.loadIMGAssets(onAssetLoadCallback);
        await this.loadHDRAssets(onAssetLoadCallback);
    }

    private async fetchAssetFile(name: string, asset: AddressableAsset) {
        const assetUrl = asset.url;

        const assetRequest = await fetch(assetUrl);
        if (!assetRequest.ok) throw new MissingAssetError(`Failed to load asset '${name}'`);

        return assetRequest;
    }

    private async loadGLTFAssets(onAssetLoadCallback?: () => void) {
        const gltfAssets = Object.keys(assetIndex.gltf);
        
        for (let k of gltfAssets) {
            const assetInfo = assetIndex.gltf[k as GLTFAssetName];
            const assetRequest = await this.fetchAssetFile(k, assetInfo);
            
            let asset: GLTFFile;
            // GLTF JSON Files
            if (assetInfo.url.endsWith(".gltf")) {
                const assetRequestJson = await assetRequest.json();
                asset = await this.loaders.gltf.constructGLTFAsset(assetRequestJson);
            }
            else if (assetInfo.url.endsWith(".glb")) {
                asset = await this.loaders.gltf.loadGLBAsset(await assetRequest.arrayBuffer());
            } else throw new BadGLTFFileError(`GLTF With unsupported filename extension (not .gltf or .glb)`);
            
            this.register(new GLTFAsset(k, assetInfo.url, asset));
            if (onAssetLoadCallback) onAssetLoadCallback();
        }
    }

    private async loadIMGAssets(onAssetLoadCallback?: () => void) {
        const imgAssets = Object.keys(assetIndex.img);

        for (let k of imgAssets) {
            const assetInfo = assetIndex.img[k as IMGAssetName];
            const assetFile = await this.fetchAssetFile(k, assetInfo);
            const assetBlob = await assetFile.blob();
            this.register(new IMGAsset(k, assetInfo.url, assetBlob));
            if (onAssetLoadCallback) onAssetLoadCallback();
        }
    }

    private async loadHDRAssets(onAssetLoadCallback?: () => void) {
        const hdrAssets = Object.keys(assetIndex.hdr);

        for (let k of hdrAssets) {
            const assetInfo = assetIndex.hdr[k as HDRAssetName];

            // try to get asset from the cache
            const assetKey = new CachedAssetKey(AssetType.HDR, k);
            const cacheHit = await this._cache.getAsset(assetKey);

            // cache miss
            if (!cacheHit) {
                // fetch and decode the asset
                const assetFile = await this.fetchAssetFile(k, assetInfo);
                const assetArrayBuffer = await assetFile.arrayBuffer();
                const data = this.loaders.hdr.decodeRGBE(new DataView(assetArrayBuffer));
                const asset = new HDRAsset(k, assetInfo.url, data);

                // try to cache it
                if (game.engine.config.game.cacheAssets) await this._cache.putAsset(new HDRCachedAsset(assetKey, asset.data));
                this.register(asset);
            }
            // asset is in cache
            else {
                const cachedData = cacheHit.data as HDRImageData;
                const asset = new HDRAsset(k, assetInfo.url, cachedData);
                this.register(asset);
            }

            if (onAssetLoadCallback) onAssetLoadCallback();
        }
    }

    assertGetAsset(name: GLTFAssetName | IMGAssetName | HDRAssetName) {
        const temp = this.all.find(a => a.name === name);
        if (!temp) throw new MissingAssetError(name);
        return temp;
    }
    
    getGLTFAsset(name: GLTFAssetName) {
        return this.assertGetAsset(name) as GLTFAsset;
    }

    getIMGAsset(name: IMGAssetName) {
        return this.assertGetAsset(name) as IMGAsset;
    }

    getHDRAsset(name: HDRAssetName) {
        return this.assertGetAsset(name) as HDRAsset;
    }

    get assetCount() {
        return Object.keys(assetIndex).reduce((prev, cur) => 
            prev += Object.keys(assetIndex[cur as keyof AssetIndex]).length
        , 0);
    }

}