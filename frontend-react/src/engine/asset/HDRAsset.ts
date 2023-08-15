import { HDRFile } from "hdr";
import { Asset } from "./Asset";

export class HDRasset extends Asset {

    constructor(name: string, url: string, private _hdrFile: HDRFile) {
        super(name, url);
    }

    get hdrFile() {
        return this._hdrFile;
    }

}