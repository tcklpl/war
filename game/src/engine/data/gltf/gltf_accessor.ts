import { GLTFAccessorValidTypes } from 'gltf';
import { BadGLTFFileError } from '../../../errors/engine/gltf/bad_gltf_file';
import { GLTFBufferView } from './gltf_buffer_view';

export class GLTFAccessor {
    private _bufferView: GLTFBufferView;
    private _componentType: number; // gl.FLOAT or gl.UNSIGNED_SHORT
    private _count: number;
    private _type: GLTFAccessorValidTypes;

    private _min?: number | number[];
    private _max?: number | number[];

    constructor(
        bufferView: GLTFBufferView,
        componentType: number,
        count: number,
        type: GLTFAccessorValidTypes,
        min?: number | number[],
        max?: number | number[],
    ) {
        const validComponentTypes: number[] = [gl.FLOAT, gl.UNSIGNED_SHORT];
        if (!validComponentTypes.includes(componentType)) {
            throw new BadGLTFFileError(
                `Invalid accessor component type: ${componentType}, expecting one of [${validComponentTypes.join(', ')}]`,
            );
        }

        this._bufferView = bufferView;
        this._componentType = componentType;
        this._count = count;
        this._type = type;
        this._min = min;
        this._max = max;
    }

    get bufferView() {
        return this._bufferView;
    }

    get componentType() {
        return this._componentType;
    }

    get count() {
        return this._count;
    }

    get type() {
        return this._type;
    }

    get min() {
        return this._min;
    }

    get max() {
        return this._max;
    }
}
