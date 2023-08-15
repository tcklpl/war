import { BufferOutOfBoundsError } from "../../../errors/engine/buffer_oob";

export class ReadableByteBuffer {
    
    constructor(private _buffer: Uint8Array, private _offset: number = 0) {

    }

    read(count: number, dst: Uint8Array, dstOffset: number = 0) {
        // check if we can read from the buffer
        if ((this._offset + count) > this._buffer.byteLength) {
            console.warn(`Cannot read ${count} bytes from buffer. (offset=${this._offset}, count+offset=${count + this._offset}, buffer size=${this._buffer.byteLength}) !!WILL READ UNTIL EOF!!`);
        }
        // check if we can write to the destination
        if ((dstOffset + count) > dst.byteLength) {
            throw new BufferOutOfBoundsError(`Cannot write ${count} bytes to dst buffer. (dst offset=${dstOffset}, count+dst offset=${count + dstOffset}, dst buffer size=${dst.byteLength})`);
        }

        let bytesRead = 0;
        do {
            dst[dstOffset + bytesRead] = this._buffer[this._offset + bytesRead];
            bytesRead++;
        } while ((this._offset + bytesRead) < this._buffer.byteLength && bytesRead < count);

        // update offset after reading bytes
        this._offset += bytesRead;

        return count;
    }

}