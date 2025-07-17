import { AssetError } from './asset-error';

export class MissingAssetError extends AssetError {
	constructor(msg?: string) {
		super(`Missing asset: ${msg}`);
	}
}
