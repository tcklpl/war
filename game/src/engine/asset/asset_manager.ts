import assetIndex from '../../asset_index.json';
import { MissingAssetError } from '../../errors/engine/asset/missing_asset';
import { BadGLTFFileError } from '../../errors/engine/gltf/bad_gltf_file';
import { GLTFFile } from '../data/gltf/gltf_file';
import { IDBConnector } from '../idb/idb_connector';
import { Manager } from '../manager';
import { Asset } from './asset';
import { AssetCache } from './cache/asset_cache';
import { AssetType } from './cache/asset_type';
import { CachedAssetKey } from './cache/cached_asset_key';
import { HDRCachedAsset } from './cache/hdr_cached_asset';
import { GLTFAsset } from './gltf_asset';
import { HDRAsset } from './hdr_asset';
import { GLTFLoader } from './loaders/gltf_loader';
import { HDRImageData, HDRLoader } from './loaders/hdr_loader';

type AssetIndex = typeof assetIndex;
type GLTFAssetName = keyof AssetIndex['gltf'];
type HDRAssetName = keyof AssetIndex['hdr'];
type AddressableAsset = { url: string };

export class AssetManager extends Manager<Asset> {
    private readonly loaders = {
        gltf: new GLTFLoader(),
        hdr: new HDRLoader(),
    };

    private _cache!: AssetCache;

    /**
     * Initializes the IDB connection inside the asset manager.
     * The IDB is used for caching assets here.
     *
     * @param connection IDB Connection
     */
    async initializeDB(connection: IDBConnector) {
        this._cache = new AssetCache(connection);

        // clear the cache if the user doesn't want to cache assets
        if (!game.engine.config.game.cacheAssets) {
            this._cache.clear();
        }
    }

    /**
     * Loads and initializes all assets into memory
     *
     * @param onAssetLoadCallback Callback when all assets are loaded
     */
    async loadAssets(onAssetLoadCallback?: () => void) {
        await this.loadGLTFAssets(onAssetLoadCallback);
        await this.loadHDRAssets(onAssetLoadCallback);
        onAssetLoadCallback?.();
    }

    /**
     * Uses "fetch" to get an asset.
     *
     * To be used when running from a browser, as we need to fetch the assets from the server.
     * @param name Asset name, used for errors.
     * @param asset Asset object identifying the asset's uri.
     * @returns fetch's Response
     */
    private async fetchAssetFile(name: string, asset: AddressableAsset) {
        const assetUrl = window.location.origin + window.location.pathname + asset.url;

        const assetRequest = await fetch(assetUrl);
        if (!assetRequest.ok) throw new MissingAssetError(`Failed to load asset '${name}'`);

        return assetRequest;
    }

    /**
     * Dispatch for loading JSON Assets.
     *
     * @param name Asset name, used for errors.
     * @param asset Asset object identifying the asset's uri.
     * @returns Required asset as a loaded object.
     */
    private async getAssetJson(name: string, asset: AddressableAsset) {
        const assetRequest = await this.fetchAssetFile(name, asset);
        return await assetRequest.json();
    }

    /**
     * Dispatch for loading Binary Assets.
     *
     * @param name Asset name, used for errors.
     * @param asset Asset object identifying the asset's uri.
     * @returns Required asset as an Array Buffer.
     */
    private async getAssetBuffer(name: string, asset: AddressableAsset) {
        const assetRequest = await this.fetchAssetFile(name, asset);
        return await assetRequest.arrayBuffer();
    }

    /**
     * Loads and constructs all GLTF Assets.
     *
     * @param onAssetLoadCallback Optional callback when all assets are loaded.
     */
    private async loadGLTFAssets(onAssetLoadCallback?: () => void) {
        const gltfAssets = Object.keys(assetIndex.gltf);

        for (const k of gltfAssets) {
            const assetInfo = assetIndex.gltf[k as GLTFAssetName];

            let asset: GLTFFile;
            // GLTF JSON Files
            if (assetInfo.url.endsWith('.gltf')) {
                const assetRequestJson = await this.getAssetJson(k, assetInfo);
                asset = await this.loaders.gltf.constructGLTFAsset(assetRequestJson);
            } else if (assetInfo.url.endsWith('.glb')) {
                asset = await this.loaders.gltf.loadGLBAsset(await this.getAssetBuffer(k, assetInfo));
            } else throw new BadGLTFFileError(`GLTF With unsupported filename extension (not .gltf or .glb)`);

            this.register(new GLTFAsset(k, assetInfo.url, asset));
            if (onAssetLoadCallback) onAssetLoadCallback();
        }
    }

    /**
     * Loads and constructs all HDR Assets.
     *
     * @param onAssetLoadCallback Optional callback when all assets are loaded.
     */
    private async loadHDRAssets(onAssetLoadCallback?: () => void) {
        const hdrAssets = Object.keys(assetIndex.hdr);

        for (const k of hdrAssets) {
            const assetInfo = assetIndex.hdr[k as HDRAssetName];

            // try to get asset from the cache
            const assetKey = new CachedAssetKey(AssetType.HDR, k);
            const cacheHit = await this._cache.getAsset(assetKey);

            // cache miss
            if (!cacheHit) {
                // fetch and decode the asset
                const assetArrayBuffer = await this.getAssetBuffer(k, assetInfo);
                const data = this.loaders.hdr.decodeRGBE(new DataView(assetArrayBuffer));
                const asset = new HDRAsset(k, assetInfo.url, data);

                // try to cache it
                if (game.engine.config.game.cacheAssets)
                    await this._cache.putAsset(new HDRCachedAsset(assetKey, asset.data));
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

    assertGetAsset(name: GLTFAssetName | HDRAssetName) {
        const temp = this.all.find(a => a.name === name);
        if (!temp) throw new MissingAssetError(name);
        return temp;
    }

    getGLTFAsset(name: GLTFAssetName) {
        return this.assertGetAsset(name) as GLTFAsset;
    }

    getHDRAsset(name: HDRAssetName) {
        return this.assertGetAsset(name) as HDRAsset;
    }

    get assetCount() {
        return Object.keys(assetIndex).reduce(
            (prev, cur) => prev + Object.keys(assetIndex[cur as keyof AssetIndex]).length,
            0,
        );
    }

    async getCachedAssetCount() {
        return await this._cache.count();
    }
}
