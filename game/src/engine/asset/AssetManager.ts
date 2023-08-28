import { Manager } from "../manager";
import { Asset } from "./Asset";
import assetIndex from "../../asset_index.json";
import { MissingAssetError } from "../../errors/engine/asset/missing_asset";
import { GLTFAsset } from "./GLTFAsset";
import { GLTFLoader } from "./loaders/gltf_loader";
import { GLTFFile } from "../data/gltf/gltf_file";
import { BadGLTFFileError } from "../../errors/engine/gltf/bad_gltf_file";
import { IMGAsset } from "./IMGAsset";

type AssetIndex = typeof assetIndex;
type GLTFAssetName = keyof AssetIndex["gltf"];
type IMGAssetName = keyof AssetIndex["img"];
type AddressableAsset = { url: string };

export class AssetManager extends Manager<Asset> {

    private loaders = {
        gltf: new GLTFLoader()
    }

    async loadAssets(onAssetLoadCallback?: () => void) {
        await this.loadGLTFAssets(onAssetLoadCallback);
        await this.loadIMGAssets(onAssetLoadCallback);
    }

    private async fetchAssetFile(name: string, asset: AddressableAsset) {
        const assetUrl = asset.url;

        const assetRequest = await fetch(assetUrl);
        if (!assetRequest.ok) throw new MissingAssetError(`Failed to load asset '${name}'`);

        return assetRequest;
    }

    private async fetchAssetImage(name: string, asset: AddressableAsset) {
        const img = new Image();
        try {
            await new Promise((r, e) => {
                img.onload = r;
                img.onerror = e;
                img.src = asset.url;
            });
        } catch (e) {
            throw new MissingAssetError(`Failed to load asset '${name}'`);
        }
        
        return img;
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
        const hdrAssets = Object.keys(assetIndex.img);

        for (let k of hdrAssets) {
            const assetInfo = assetIndex.img[k as IMGAssetName];
            const asset = await this.fetchAssetImage(k, assetInfo);
            this.register(new IMGAsset(k, assetInfo.url, asset));
            if (onAssetLoadCallback) onAssetLoadCallback();
        }
    }

    assertGetAsset(name: GLTFAssetName | IMGAssetName) {
        const temp = this.all.find(a => a.name === name);
        if (!temp) throw new MissingAssetError(name);
        return temp;
    }
    
    getGLTFAsset(name: GLTFAssetName) {
        return this.assertGetAsset(name) as GLTFAsset;
    }

    getHDRAsset(name: IMGAssetName) {
        return this.assertGetAsset(name) as IMGAsset;
    }

    get assetCount() {
        return Object.keys(assetIndex).reduce((prev, cur) => 
            prev += Object.keys(assetIndex[cur as keyof AssetIndex]).length
        , 0);
    }

}