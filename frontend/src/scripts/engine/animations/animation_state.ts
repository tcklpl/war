import { Game3DObject } from "../objects/game3d_obj";
import { Animation } from "./animation";


export class AnimationState {

    private _id: number;
    private obj: Game3DObject;
    private animation: Animation;
    private currentFrame: number;
    private ended: boolean;

    onFinish?: (id: number) => void;

    constructor(id: number, obj: Game3DObject, animation: Animation, startingFrame?: number) {
        this._id = id;
        this.obj = obj;
        this.animation = animation;
        this.currentFrame = startingFrame || 0;
        this.ended = false;
    }

    offsetBy(offset: number) {
        if (this.currentFrame + offset >= this.animation.length) {
            this.currentFrame = this.animation.length;
            this.ended = true;
        } else {
            this.currentFrame += offset;
        }
    }

    applyCurrentAnimationOffset() {
        let frame = this.animation.getFrameAt(this.currentFrame);
        this.obj.setTranslation(frame.position);
        this.obj.setRotation(frame.rotation);
        this.obj.setScale(frame.scale);

        if (this.ended) {
            if (this.onFinish) this.onFinish(this._id);
        }
    }

    public get id() {
        return this._id;
    }
}