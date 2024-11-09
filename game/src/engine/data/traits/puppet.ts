import { Constructor } from 'typeUtils';
import { Animatable } from '../animation/animatable';
import { AnimationObjectPuppeteer } from '../animation/animation_object_puppeteer';

export interface IPuppet<T extends Animatable> {
    get puppeteer(): AnimationObjectPuppeteer<T>;
}

export function puppet<T extends Animatable, C extends Constructor<Animatable>>(base: C): Constructor<IPuppet<T>> & C {
    return class extends base {
        readonly _puppeteer: AnimationObjectPuppeteer<T>;

        constructor(...args: any[]) {
            super(...args);
            this._puppeteer = game.engine.orchestrator.getObjectPuppeteer<T>(this as unknown as T);
        }

        get puppeteer() {
            return this._puppeteer;
        }
    };
}
