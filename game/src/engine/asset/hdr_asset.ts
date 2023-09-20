import { Asset } from "./asset";
import { HDRImageData } from "./loaders/hdr_loader";

export class HDRAsset extends Asset {

    constructor(name: string, url: string, private _data: HDRImageData) {
        super(name, url);
    }

    get data() {
        return this._data;
    }

}