import { BufferUtils } from "../../../utils/buffer_utils";

export class LuminanceHistogram {

    readonly bins = 256;
    private _rawData: Uint32Array = new Uint32Array(new Array(this.bins).fill(0));
    private _buffer = BufferUtils.createEmptyBuffer(this.bins * 4, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);

    /**
     * Maps and reads the luminance histogram result buffer.
     */
    async updateLuminanceHistogram() {
        await this._buffer.mapAsync(GPUMapMode.READ);
        const newData = new Uint32Array(this._buffer.getMappedRange());
        this.updateRawData(newData);
        this._buffer.unmap();
    }

    private updateRawData(data: Uint32Array) {
        if (data.length !== 256) {
            console.warn(`Trying to update a luminance histogram with an array of length ${data.length}, should've been ${this.bins}`);
            return;
        }
        this._rawData.set(data);
    }

    get buffer() {
        return this._buffer;
    }

    free() {
        this._buffer?.destroy();
    }

}