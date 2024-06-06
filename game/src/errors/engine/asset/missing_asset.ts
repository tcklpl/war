import { AssetError } from './asset_error';

export class MissingAssetError extends AssetError {
    constructor(msg?: string) {
        super(`Missing asset: ${msg}`);
    }
}
