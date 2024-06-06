export abstract class Manager<T> {
    private _registered: T[] = [];

    register(item: T) {
        this._registered.push(item);
    }

    registerAll(items: T[]) {
        this._registered.push(...items);
    }

    get all() {
        return this._registered;
    }
}
