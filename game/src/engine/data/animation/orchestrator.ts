import { Animatable } from './animatable';
import { AnimationObjectPuppeteer } from './animation_object_puppeteer';

export class Orchestrator {
    private readonly _animationsBeingPlayed = new Map<Animatable, AnimationObjectPuppeteer<any>>();

    /**
     * Updates all puppeteers to apply their transformations using the deltaFrame
     *
     * @param deltaFrame Seconds since last frame
     */
    update(deltaFrame: number) {
        this._animationsBeingPlayed.forEach(puppeteer => puppeteer.applyTransformationsForDeltaFrame(deltaFrame));
    }

    /**
     * Purges all finished animations from all puppeteers
     */
    purgeFinishedAnimations() {
        this._animationsBeingPlayed.forEach(puppeteer => puppeteer.purgeFinishedAnimations());
    }

    /**
     * Gets the existing or creates a new puppeteer for the object
     *
     * @param object Animatable object
     * @returns Existing or new puppeteer
     */
    getObjectPuppeteer<T extends Animatable>(object: T): AnimationObjectPuppeteer<T> {
        let puppeteer = this._animationsBeingPlayed.get(object) as AnimationObjectPuppeteer<T> | undefined;
        if (!puppeteer) {
            puppeteer = new AnimationObjectPuppeteer(object);
            this._animationsBeingPlayed.set(object, puppeteer);
        }
        return puppeteer;
    }
}
