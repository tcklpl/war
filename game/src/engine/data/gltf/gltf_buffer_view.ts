import { BadGLTFFileError } from '../../../errors/engine/gltf/bad_gltf_file';
import { BufferUtils } from '../../../utils/buffer_utils';
import { GLTFBuffer } from './gltf_buffer';

export class GLTFBufferView {
    private readonly ARRAY_BUFFER = 34962;
    private readonly ELEMENT_ARRAY_BUFFER = 34963;

    private readonly _buffer: GLTFBuffer;
    private readonly _length: number;
    private readonly _offset: number;
    private readonly _target?: number; // gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER or undefined

    constructor(buffer: GLTFBuffer, length: number, offset: number, target?: number) {
        const validTargetTypes: number[] = [this.ARRAY_BUFFER, this.ELEMENT_ARRAY_BUFFER];
        if (!!target && !validTargetTypes.includes(target)) {
            throw new BadGLTFFileError(`Invalid buffer view target type: ${target}`);
        }

        this._buffer = buffer;
        this._length = length;
        this._offset = offset;
        this._target = target;
    }

    get buffer() {
        return this._buffer;
    }

    get length() {
        return this._length;
    }

    get offset() {
        return this._offset;
    }

    get target() {
        return this._target;
    }

    getSlicedBufferData() {
        return this._buffer.data.slice(this._offset, this._offset + this._length);
    }

    buildBuffer() {
        const slice = this.getSlicedBufferData();
        const bufferUsage = () => {
            switch (this._target) {
                case this.ARRAY_BUFFER:
                    return GPUBufferUsage.VERTEX;
                case this.ELEMENT_ARRAY_BUFFER:
                    return GPUBufferUsage.INDEX;
                default:
                    throw new TypeError(`Trying to build buffer for non-mesh buffer view`);
            }
        };
        const buffer = BufferUtils.createBuffer(new Uint8Array(slice), bufferUsage() | GPUBufferUsage.COPY_DST);
        return buffer;
    }
}
