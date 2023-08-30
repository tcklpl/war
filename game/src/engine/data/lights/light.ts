import { Vec3 } from "../vec/vec3";

export abstract class Light {

    constructor(
        private _name: string, 
        private _position: Vec3,
        private _color: Vec3, 
        private _intensity: number, 
        private _range: number, 
        private _enabled: boolean = true
        ) {

    }

    get name() {
        return this._name;
    }

    get position() {
        return this._position;
    }

    get color() {
        return this._color;
    }

    get intensity() {
        return this._intensity;
    }

    get range() {
        return this._range;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(e: boolean) {
        this._enabled = this.enabled;
    }

    abstract writeToBuffer(buf: GPUBuffer, index: number, generalBufferOffset: number): void;    

}