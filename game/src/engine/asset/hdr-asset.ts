import { Asset } from './asset';
import type { HDRImageData } from './loaders/hdr-loader';

export class HDRAsset extends Asset {
	constructor(
		name: string,
		url: string,
		private readonly _data: HDRImageData,
	) {
		super(name, url);
	}

	get data() {
		return this._data;
	}
}
