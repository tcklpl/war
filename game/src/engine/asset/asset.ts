export abstract class Asset {
    constructor(
        private _name: string,
        private _url: string,
    ) {}

    get name() {
        return this._name;
    }

    get url() {
        return this._url;
    }
}
