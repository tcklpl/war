import { Asset } from "./Asset";

export class IMGAsset extends Asset {

    constructor(name: string, url: string, private _imgElement: HTMLImageElement) {
        super(name, url);
    }

    get imgElement() {
        return this._imgElement;
    }

    get width() {
        return this._imgElement.width;
    }

    get height() {
        return this._imgElement.height;
    }

    async toBitmap() {
        return await createImageBitmap(
            this._imgElement,
            {
                colorSpaceConversion: 'none',
                imageOrientation: 'flipY'
            }
        );
    }

}