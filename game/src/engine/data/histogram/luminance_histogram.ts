import { BufferUtils } from "../../../utils/buffer_utils";

export class LuminanceHistogram {

    readonly bins = 256;
    private _rawData: Uint32Array = new Uint32Array(new Array(this.bins).fill(0));
    private _buffer = BufferUtils.createEmptyBuffer(this.bins * 4, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ, 'Luminance histogram');
    private _avg: number = 0;

    /**
     * Maps and reads the luminance histogram result buffer.
     */
    async updateLuminanceHistogram() {
        try {
            await this._buffer.mapAsync(GPUMapMode.READ);
            const newData = new Uint32Array(this._buffer.getMappedRange());
            this.updateRawData(newData);
            this._buffer.unmap();
            this.calculateAverage();
        } catch (e) {
            console.warn('Failed to map luminance histogram buffer, probably because the histogram is being deleted');
        }
    }

    /**
     * Replaces the histogram data, checking to see if the new data is of the correct length.
     * @param data The new histogram data.
     */
    private updateRawData(data: Uint32Array) {
        if (data.length !== 256) {
            console.warn(`Trying to update a luminance histogram with an array of length ${data.length}, should've been ${this.bins}`);
            return;
        }
        this._rawData.set(data);
    }

    private calculateAverage() {
        let total = 0;
        this._avg = this._rawData.reduce((sum, cur, i) => {
            const binLDRSlice = i / (this.bins - 1);
            total += cur;
            return sum + (cur * binLDRSlice);
        }, 0) / (total);
    }

    get buffer() {
        return this._buffer;
    }

    get avg() {
        return this._avg;
    }

    free() {
        this._buffer?.destroy();
    }

}