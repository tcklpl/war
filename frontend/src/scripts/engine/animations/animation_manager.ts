import { Game3DObject } from "../objects/game3d_obj";
import { Animation } from "./animation";
import { AnimationState } from "./animation_state";

export class AnimationManager {

    private animationList: Animation[] = [];

    private playing: Map<number, AnimationState> = new Map();
    private currentAnimationId: number = 0;

    registerAnimation(animation: Animation) {
        this.animationList.push(animation);
    }

    getAnimation(name: string) {
        return this.animationList.find(x => x.name == name);
    }

    playAnimation(obj: Game3DObject, animation: Animation, finishCallback?: () => void): number {
        if (!obj || !animation) throw `Failed to create animation with null object or animation data`;

        let state = new AnimationState(this.currentAnimationId, obj, animation);
        state.onFinish = (id: number) => {
            this.playing.delete(id);
            if (finishCallback) finishCallback();
        }
        this.playing.set(this.currentAnimationId, state);

        return this.currentAnimationId++;
    }

    stopAnimation(id: number) {
        if (!this.playing.delete(id)) console.warn(`Failed to stop animation with id '${id}': Not found`);
    }

    animate(msDelay: number) {
        this.playing.forEach((as: AnimationState) => {
            as.offsetBy(msDelay);
            as.applyCurrentAnimationOffset();
        });
    }

}