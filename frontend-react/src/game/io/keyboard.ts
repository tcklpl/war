
type KeyEvent = 'up' | 'down';

export class Keyboard {

    private _keyDownListeners: Map<string, (() => void)[]> = new Map();
    private _keyUpListeners: Map<string, (() => void)[]> = new Map();

    constructor() {
        window.addEventListener('keydown', e => this.onKeyEvent(e, 'down'));
        window.addEventListener('keyup', e => this.onKeyEvent(e, 'up'));
    }

    private onKeyEvent(e: KeyboardEvent, eventType: KeyEvent) {
        const key = e.key.toLowerCase();
        const listeners = eventType === 'down' ? this._keyDownListeners : this._keyUpListeners;
        listeners.get(key)?.forEach(cb => cb());
    }

    registerKeyListener(key: string, eventType: KeyEvent, cb: () => void) {
        key = key.toLowerCase();
        const listeners = eventType === 'down' ? this._keyDownListeners : this._keyUpListeners;
        const keyListeners = listeners.get(key);
        if (keyListeners) {
            keyListeners.push(cb);
        } else {
            listeners.set(key, [cb]);
        }
    }
}