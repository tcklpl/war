import { GLTFFile } from "../data/gltf/gltf_file";
import { Asset } from "./asset";

export class GLTFAsset extends Asset {

    constructor(name: string, url: string, private _gltfFile: GLTFFile) {
        super(name, url);
    }

    get gltfFile() {
        return this._gltfFile;
    }

}