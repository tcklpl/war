import { GameEvents } from './game_events';

type GameEvent = keyof GameEvents;

export class EventManager {
    private readonly _eventListeners = new Map<GameEvent, ((...args: any[]) => void)[]>();

    registerListener<T extends GameEvent>(event: T, listener: GameEvents[T]) {
        let listeners = this._eventListeners.get(event);
        if (!listeners) {
            listeners = [];
            this._eventListeners.set(event, listeners);
        }
        listeners.push(listener);
    }

    dispatchEvent<T extends GameEvent>(event: T, ...params: Parameters<GameEvents[T]>) {
        this._eventListeners.get(event)?.forEach(listener => listener(...params));
    }
}
