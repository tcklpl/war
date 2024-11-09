export abstract class Asset {
    constructor(
        private readonly _name: string,
        private readonly _url: string,
    ) {}

    get name() {
        return this._name;
    }

    get url() {
        return this._url;
    }
}
