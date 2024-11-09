import { AnimationUtils } from '../../../utils/animation_utils';
import { Animatable } from './animatable';
import { Animation } from './animation';
import { AnimationPlayback } from './animation_playback';

export class AnimationObjectPuppeteer<T extends Animatable> {
    private _playbacks: AnimationPlayback<T>[] = [];

    constructor(private readonly object: T) {}

    /**
     * Starts a playback of the specified animation
     *
     * @param animation Animation to start the playback
     */
    playAnimation<S extends T>(animation: Animation<S>) {
        this._playbacks.push(animation.newPlaybackFor(this.object as unknown as S) as unknown as AnimationPlayback<T>);
    }

    /**
     * Purge all finished animations from the playbacks registry
     */
    purgeFinishedAnimations() {
        if (this._playbacks.find(p => p.isFinished)) {
            this._playbacks = this._playbacks.filter(p => !p.isFinished);
        }
    }

    /**
     * Clears the animation registry
     */
    cancelAllAnimations() {
        this._playbacks = [];
    }

    /**
     * Applies transformations for all animations on the current frame, interpolated as increments using the deltaFrame
     *
     * @param deltaFrame Seconds since last frame
     */
    applyTransformationsForDeltaFrame(deltaFrame: number) {
        this._playbacks
            .filter(p => !p.isFinished)
            .forEach(playback => {
                const animationTransformations = playback.updateOffset(deltaFrame);
                animationTransformations.forEach(value => AnimationUtils.applyTransformations(this.object, value));
            });
    }
}
