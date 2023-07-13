
export abstract class Manager<T> {

    private _registered: T[] = [];

    register(item: T) {
        this._registered.push(item);
    }

    get all() {
        return this._registered;
    }
    
}