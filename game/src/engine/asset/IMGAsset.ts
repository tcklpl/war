import { Asset } from "./Asset";

export class IMGAsset extends Asset {

    constructor(name: string, url: string, private _blob: Blob) {
        super(name, url);
    }

    get imgElement() {
        return this._blob;
    }

    async toBitmap() {        
        return await createImageBitmap(
            this._blob,
            {
                colorSpaceConversion: 'none',
                imageOrientation: 'flipY',
                resizeQuality: 'high'
            }
        );
    }

}