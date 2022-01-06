import { Vec3 } from "../data_formats/vec/vec3";
import { Interpolators } from "../interpolators";

export enum KeyframeInterpolation {
    LINEAR = "linear"
}

export interface IKeyframe {
    delay: number;
    interpolation: KeyframeInterpolation;
    position?: Vec3;
    rotation?: Vec3;
    scale?: Vec3;
}

export interface AnimationFrame {
    position: Vec3;
    rotation: Vec3;
    scale: Vec3;
}

export class Animation {

    private _name: string;
    private keyframes: IKeyframe[];

    constructor(name: string, keyframes: IKeyframe[]) {
        this._name = name;
        this.keyframes = keyframes;

        let basePosition = keyframes[0].position || new Vec3(0, 0, 0);
        let baseRotation = keyframes[0].rotation || new Vec3(0, 0, 0);
        let baseScale = keyframes[0].scale || new Vec3(1, 1, 1);

        keyframes[0].position = basePosition;
        keyframes[0].rotation = baseRotation;
        keyframes[0].scale = baseScale;

        // first make sure all 
        for (let i = 0; i < keyframes.length; i++) {
            keyframes[i].position = keyframes[i].position || this.interpolatedPosKeyframe(i);
            keyframes[i].rotation = keyframes[i].rotation || this.interpolatedRotKeyframe(i);
            keyframes[i].scale = keyframes[i].scale || this.interpolatedScaleKeyframe(i);
        }
    }

    getFrameAt(delay: number) {
        let keyframe = this.keyframes.find(x => x.delay == delay);
        if (keyframe) {
            return <AnimationFrame> {
                position: keyframe.position,
                rotation: keyframe.rotation,
                scale: keyframe.scale
            }
        }
        // no key frame, will need to interpolate
        let lowerBound!: IKeyframe;
        let upperBound!: IKeyframe;
        for (let i = 0; i < this.keyframes.length; i++) {
            if (this.keyframes[i].delay < delay) lowerBound = this.keyframes[i];
            if (this.keyframes[i].delay > delay) {
                upperBound = this.keyframes[i];
                break;
            }
        }
        let interval = upperBound.delay - lowerBound.delay - 1;
        return <AnimationFrame> {
            position: Interpolators.vec3LinearSingleValue(lowerBound.position as Vec3, upperBound.position as Vec3, interval, delay),
            rotation: Interpolators.vec3LinearSingleValue(lowerBound.rotation as Vec3, upperBound.rotation as Vec3, interval, delay),
            scale: Interpolators.vec3LinearSingleValue(lowerBound.scale as Vec3, upperBound.scale as Vec3, interval, delay)
        }
    }

    private interpolatedPosKeyframe(index: number) {
        let lowerLimit: IKeyframe = this.keyframes[0];
        let upperLimit: IKeyframe = this.keyframes[0];
        
        // get lower bound
        for (let i = index - 1; i > 0; i--) {
            if (this.keyframes[i].position) lowerLimit = this.keyframes[i];
        }

        // get higher bound
        for (let i = index; i < this.keyframes.length; i++) {
            if (this.keyframes[i].position) upperLimit = this.keyframes[i];
        }

        return Interpolators.vec3LinearSingleValue(lowerLimit.position as Vec3, upperLimit.position as Vec3, 1, 1);
    }

    private interpolatedRotKeyframe(index: number) {
        let lowerLimit: IKeyframe = this.keyframes[0];
        let upperLimit: IKeyframe = this.keyframes[0];
        
        // get lower bound
        for (let i = index - 1; i > 0; i--) {
            if (this.keyframes[i].rotation) lowerLimit = this.keyframes[i];
        }

        // get higher bound
        for (let i = index; i < this.keyframes.length; i++) {
            if (this.keyframes[i].rotation) upperLimit = this.keyframes[i];
        }

        return Interpolators.vec3LinearSingleValue(lowerLimit.rotation as Vec3, upperLimit.rotation as Vec3, 1, 1);
    }

    private interpolatedScaleKeyframe(index: number) {
        let lowerLimit: IKeyframe = this.keyframes[0];
        let upperLimit: IKeyframe = this.keyframes[0];
        
        // get lower bound
        for (let i = index - 1; i > 0; i--) {
            if (this.keyframes[i].scale) lowerLimit = this.keyframes[i];
        }

        // get higher bound
        for (let i = index; i < this.keyframes.length; i++) {
            if (this.keyframes[i].scale) upperLimit = this.keyframes[i];
        }

        return Interpolators.vec3LinearSingleValue(lowerLimit.scale as Vec3, upperLimit.scale as Vec3, 1, 1);
    }

    public get name() {
        return this._name;
    }

    public get length() {
        return this.keyframes[this.keyframes.length - 1].delay;
    }
}