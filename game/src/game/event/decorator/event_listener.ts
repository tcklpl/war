import { GameEvents } from '../game_events';

export function EventListener(event: keyof GameEvents) {
    return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
        // Decorators are evaluated pretty early, when even the game global is undefined.
        // Nothing we can do about it, so We'll just check every 1s to see if we can register ¯\_(ツ)_/¯
        const tryToRegisterListener = () => {
            if (globalThis.game) {
                game.events.registerListener(event, (...args: any[]) => descriptor.value(...args));
            } else {
                setTimeout(() => tryToRegisterListener(), 1000);
            }
        };

        tryToRegisterListener();
    };
}
