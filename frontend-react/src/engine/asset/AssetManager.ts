import { Manager } from "../manager";
import { Asset } from "./Asset";
import assetIndex from "../../asset_index.json";
import { MissingAssetError } from "../../errors/engine/asset/missing_asset";
import { GLTFAsset } from "./GLTFAsset";
import { GLTFLoader } from "../loader/gltf/gltf_loader";
import { GLTFFile } from "../data/gltf/gltf_file";
import { BadGLTFFileError } from "../../errors/engine/gltf/bad_gltf_file";
import { HDRLoader } from "../loader/hdr/hdr_loader";
import { HDRasset } from "./HDRAsset";

type AssetIndex = typeof assetIndex;
type GLTFAssetName = keyof AssetIndex["gltf"];
type HDRAssetName = keyof AssetIndex["hdr"];
type AddressableAsset = { url: string };

export class AssetManager extends Manager<Asset> {

    private loaders = {
        gltf: new GLTFLoader(),
        hdr: new HDRLoader()
    }

    async loadAssets() {
        await this.loadGLTFAssets();
        await this.loadHDRAssets();
    }

    private async fetchAssetFile(name: string, asset: AddressableAsset) {
        const assetUrl = asset.url;

        const assetRequest = await fetch(assetUrl);
        if (!assetRequest.ok) throw new MissingAssetError(`Failed to load asset '${name}'`);

        return assetRequest;
    }

    private async loadGLTFAssets() {
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
        }
    }

    private async loadHDRAssets() {
        const hdrAssets = Object.keys(assetIndex.hdr);

        for (let k of hdrAssets) {
            const assetInfo = assetIndex.hdr[k as HDRAssetName];
            const assetRequest = await this.fetchAssetFile(k, assetInfo);

            this.register(new HDRasset(k, assetInfo.url, this.loaders.hdr.loadHDRFile(await assetRequest.arrayBuffer())))
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