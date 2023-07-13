import { BadGLTFFileError } from "../../../errors/engine/gltf/bad_gltf_file";
import { BufferUtils } from "../../../utils/buffer_utils";
import { GLTFBuffer } from "./gltf_buffer";


export class GLTFBufferView {

    private _buffer: GLTFBuffer;
    private _length: number;
    private _offset: number;
    private _target: number; // gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER

    constructor(buffer: GLTFBuffer, length: number, offset: number, target: number) {

        const validTargetTypes: number[] = [gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER];
        if (!validTargetTypes.includes(target)) {
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

    buildBuffer() {
        const slice = this._buffer.data.slice(this._offset, this._offset + this._length);
        // f32array for vertices and ui16array for indices
        const newTypedArray = this._target === gl.ARRAY_BUFFER ? Float32Array.from(slice) : Uint16Array.from(slice);
        const bufferUsage = this._target === gl.ARRAY_BUFFER ? GPUBufferUsage.VERTEX : GPUBufferUsage.INDEX;
        const buffer = BufferUtils.createBuffer(newTypedArray, bufferUsage);
        return buffer;
    }

}