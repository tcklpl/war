
export class MissingAssetError extends Error {

    constructor(msg?: string) {
        super(`Missing asset: ${msg}`);
    }
}