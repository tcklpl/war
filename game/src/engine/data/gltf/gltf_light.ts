import { KHR_lights_punctual_Types } from 'gltf';
import { BadGLTFFileError } from '../../../errors/engine/gltf/bad_gltf_file';
import { InvalidGLTFProperty } from '../../../errors/engine/gltf/invalid_gltf_property';

export class GLTFLight {
    private _name: string;
    private _type: KHR_lights_punctual_Types;
    private _color: number[];
    private _intensity: number;
    private _range?: number;

    constructor(name: string, type: KHR_lights_punctual_Types, color: number[], intensity: number, range?: number) {
        if (color.length !== 3)
            throw new BadGLTFFileError(`Light color should be a Vec3, but has length ${color.length}`);

        this._name = name;
        this._type = type;
        this._color = color;
        this._intensity = intensity;
        this._range = range;
    }

    get name() {
        return this._name;
    }

    get type() {
        return this._type;
    }

    get color() {
        return this._color;
    }

    get intensity() {
        return this._intensity;
    }

    get range() {
        if (this.type !== 'point' && this.type !== 'spot')
            throw new InvalidGLTFProperty('Trying to get range from a light that is not point or spot');
        return this._range as number;
    }
}
