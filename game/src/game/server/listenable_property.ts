export class ListenableProperty<T> {
    private _value?: T;
    private _listeners: ((value?: T) => void)[] = [];

    constructor(initialState?: T) {
        this._value = initialState;
    }

    get value() {
        return this._value;
    }

    set value(v: T | undefined) {
        this._value = v;
        this._listeners.forEach(l => l(this._value));
    }

    listen(listener: (value?: T) => void) {
        this._listeners.push(listener);
    }
}
