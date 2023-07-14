import { BufferError } from "../errors/engine/data/buffer_error";


export class BufferUtils {

    static createBuffer<T extends ArrayLike<number> & {byteLength: number, set: (array: ArrayLike<number>, offset?: number | undefined) => void}>(data: T, usage: number) {

        device.pushErrorScope('out-of-memory');

        const buffer = device.createBuffer({
            size: data.byteLength,
            usage: usage,
            mappedAtCreation: true
        });
        const dst = new Uint8Array(buffer.getMappedRange());
        dst.set(data);
        buffer.unmap();

        device.popErrorScope().then(err => {
            if (err) {
                throw new BufferError(`OUT OF MEMORY: Failed to allocate buffer of length ${data.byteLength}] with usage ${usage}`);
            }
        });

        return buffer;
    }

    static createEmptyBuffer(size: number, usage: number) {

        device.pushErrorScope('out-of-memory');

        const buffer = device.createBuffer({
            size: size,
            usage: usage
        });

        device.popErrorScope().then(err => {
            if (err) {
                throw new BufferError(`OUT OF MEMORY: Failed to allocate buffer of length ${size}] with usage ${usage}`);
            }
        });

        return buffer;

    }

}