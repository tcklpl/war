import { Manager } from "../manager";
import { Asset } from "./Asset";
import assetIndex from "../../asset_index.json";
import { MissingAssetError } from "../../errors/engine/asset/missing_asset";
import { GLTFAsset } from "./GLTFAsset";
import { GLTFLoader } from "../loader/gltf/gltf_loader";
import { GLTFFile } from "../data/gltf/gltf_file";
import { BadGLTFFileError } from "../../errors/engine/gltf/bad_gltf_file";

type AssetIndex = typeof assetIndex;
type GLTFAssetName = keyof AssetIndex["gltf"];

export class AssetManager extends Manager<Asset> {

    private loaders = {
        gltf: new GLTFLoader()
    }

    async loadAssets() {
        await this.loadGLTFAssets();
    }

    private async loadGLTFAssets() {
        const gltfAssets = Object.keys(assetIndex.gltf);
        
        for (let k of gltfAssets) {
            const assetInfo = assetIndex.gltf[k as GLTFAssetName];
            const assetUrl = assetInfo.url;

            const assetRequest = await fetch(assetUrl);
            if (!assetRequest.ok) throw new MissingAssetError(`Failed to load asset '${k}'`);
            
            let asset: GLTFFile;
            // GLTF JSON Files
            if (assetUrl.endsWith(".gltf")) {
                const assetRequestJson = await assetRequest.json();
                asset = await this.loaders.gltf.constructGLTFAsset(assetRequestJson);
            }
            else if (assetUrl.endsWith(".glb")) {
                asset = await this.loaders.gltf.loadGLBAsset(await assetRequest.arrayBuffer());
            } else throw new BadGLTFFileError(`GLTF With unsupported filename extension (not .gltf or .glb)`);
            
            this.register(new GLTFAsset(k, assetUrl, asset));
        }
    }

    assertGetAsset(name: GLTFAssetName) {
        const temp = this.all.find(a => a.name === name);
        if (!temp) throw new MissingAssetError(name);
        return temp;
    }
    
    getGLTFAsset(name: GLTFAssetName) {
        return this.assertGetAsset(name) as GLTFAsset;
    }

}