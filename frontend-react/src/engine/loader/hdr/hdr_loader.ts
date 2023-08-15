import { HDRFile } from "hdr";
import { BadHDRFileError } from "../../../errors/engine/hdr/bad_hdr_file";
import { ReadableByteBuffer } from "../utils/readable_b_buffer";

const HEADER = "#?RADIANCE";
const NEW_LINE_CHARACTER = 0x0a;

const RX_COMMENT = /#.+/;
const RX_FORMAT = /FORMAT=(.+)/;
const RX_GAMMA = /GAMMA=(.+)/;
const RX_EXPOSURE = /EXPOSURE=(.+)/;
const RX_DIMENSIONS = /-Y ([0-9]+) \+X ([0-9]+)/; // TODO: add proper support for orientations

type HDRFileStructure = {
    format?: string;
    gamma?: number;
    exposure?: number;
    width: number;
    height: number;
}

export class HDRLoader {

    private _supportedFormats = [
        "32-bit_rle_rgbe"
    ];

    *readHeaderLine(blob: Uint8Array) {
        let offset = 0;
        let line = "";
        let headerIsOver = false;

        let imageSizeOnNextLine = false;
        do {
            let byte = blob[offset];
            if (byte === NEW_LINE_CHARACTER) {

                // If we're reading the image resolution the image will come after this.
                if (imageSizeOnNextLine) {
                    headerIsOver = true;
                }

                // If the line is just a new line character the header is over,
                // the next line will be the resolution and the binary file after that.
                if (line === "") {
                    imageSizeOnNextLine = true;
                }

                yield line;

                line = "";
            } else {
                line += String.fromCharCode(byte);
            }

            ++offset;

        } while (!headerIsOver && offset < blob.byteLength);
        
        // Return the offset when we're done reading the header
        return offset;
    }

    loadHDRFile(blob: ArrayBuffer): HDRFile {
        const blobAsUint8 = new Uint8Array(blob);
        const headerLines = this.readHeaderLine(blobAsUint8);
        
        let headerLineResult = headerLines.next();
        if (headerLineResult.value !== HEADER) throw new BadHDRFileError(`File doesn't start with the identifying line`);
        const file: HDRFileStructure = {width: 0, height: 0};

        while (!headerLineResult.done) {
            const line = headerLineResult.value;
            
            let match;
            // Format
            if (match = line.match(RX_FORMAT)) {
                file.format = match[1];
            }
            // Exposure
            else if (match = line.match(RX_EXPOSURE)) {
                file.exposure = parseFloat(match[1]);
            }
            // Gamma
            else if (match = line.match(RX_GAMMA)) {
                file.gamma = parseFloat(match[1]);
            }
            // Dimensions
            else if (match = line.match(RX_DIMENSIONS)) {
                file.height = parseInt(match[1]);
                file.width = parseInt(match[2]);
            }
            // Comments and Empty header line
            else if (match = line.match(RX_COMMENT) || line === '') {
                // Ignore comments
            }
            // Unknown header parameter
            else {
                throw new BadHDRFileError(`Unknown header line: '${line}'`);
            }

            headerLineResult = headerLines.next();
        }
        // the return value will be the offset when the parsing is over
        const offset = headerLineResult.value;
        
        if (!file.format || !this._supportedFormats.find(x => x === file.format))
            throw new BadHDRFileError(`Invalid or unsupported format '${file.format}', was expecting one of [${this._supportedFormats.join(", ")}]`);

        if (!file.width || !file.height || file.width <= 0 || file.height <= 0)
            throw new BadHDRFileError(`Invalid dimensions [${file.width}, ${file.height}]`);

        file.gamma = file.gamma ?? 2.2;
        file.exposure = file.exposure ?? 1;

        const rbb = new ReadableByteBuffer(blobAsUint8, offset);
        const output = new Float32Array(file.width * file.height * 3);

        this.RGBEReadPixelsRLE(rbb, 0, file.width, file.height, output, 0);

        return {
            width: file.width,
            height: file.height,
            exposure: file.exposure ?? 1,
            gamma: file.gamma ?? 1,
            format: file.format,
            f32Data: output
        }
    }

    private RGBEtoFloat(data: Uint8Array, dataOffset: number, dst: Float32Array, dstOffset: number) {
        let r = data[dataOffset + 0] / 255;
        let g = data[dataOffset + 1] / 255;
        let b = data[dataOffset + 2] / 255;
        const e = data[dataOffset + 3];

        let f = Math.pow(2, e - 128);

        r *= f;
        g *= f;
        b *= f;

        dst[dstOffset + 0] = r;
        dst[dstOffset + 1] = g;
        dst[dstOffset + 2] = b;
    }

    private RGBEReadPixels(data: ReadableByteBuffer, y: number, pixelCount: number, dst: Float32Array, dstOffset: number) {
        const size = 4 * pixelCount;
        const buffer = new Uint8Array(size);

        // read image to buffer
        if (data.read(size, buffer) !== size) {
            throw new BadHDRFileError(`Error reading pixels on scanline ${y}`);
        }

        // convert from rgbe to floats
        for (let i = 0; i < pixelCount; i++) {
            this.RGBEtoFloat(buffer, 4 * i, dst, dstOffset + 3 * i);
        }

    }

    private RGBEReadPixelsRLE(data: ReadableByteBuffer, y: number, scanlineWidth: number, numScanlines: number, dst: Float32Array, dstOffset: number) {

        if (scanlineWidth < 8 || scanlineWidth > 0x7fff) {
            // RLE is not allowed so read flat
            return this.RGBEReadPixels(data, y, scanlineWidth * numScanlines, dst, dstOffset);
        }

        const rgbeBuffer = new Uint8Array(4);
        const rleBuffer = new Uint8Array(2);

        while (numScanlines > 0) {
            
            if (data.read(4, rgbeBuffer) !== 4) {
                throw new BadHDRFileError(`Read error on scanline ${y}`);
            }

            if ((rgbeBuffer[0] !== 2) || (rgbeBuffer[1] !== 2) || (rgbeBuffer[2] & 0x80)) {
                // file is nor run length encoded
                this.RGBEtoFloat(rgbeBuffer, 0, dst, 0);
                dstOffset += 3;
                return this.RGBEReadPixels(data, y, scanlineWidth * numScanlines - 1, dst, dstOffset);
            }

            if (((rgbeBuffer[2]) << 8 | rgbeBuffer[3]) !== scanlineWidth) {
                throw new BadHDRFileError(`Wrong scanline width for scanline ${y}`);
            }

            const scanlineBuffer = new Uint8Array(4 * scanlineWidth);
            let ptr = 0;

            // read each of the four channels into the buffer
            for (let i = 0; i < 4; i++) {

                const ptrEnd = (i + 1) * scanlineWidth;
                while (ptr < ptrEnd) {

                    if (data.read(2, rleBuffer) !== 2) {
                        throw new BadHDRFileError(`Read error on scanline ${y}: cannot read 2-byte buffer`);
                    }

                    if (rleBuffer[0] > 128) {
                        // a run of the same value
                        let count = rleBuffer[0] - 128;

                        if (count === 0 || count > (ptrEnd - ptr)) {
                            throw new BadHDRFileError(`Bad run scanline ${y} data: ptr=${ptr} ptrEnd=${ptrEnd} count=${count}, buf[0]=${rleBuffer[0]}, buf[1]=${rleBuffer[1]}`);
                        }

                        while (count-- > 0) {
                            scanlineBuffer[ptr++] = rleBuffer[1];
                        }
                    }
                    else {
                        // a non-run
                        let count = rleBuffer[0];

                        if (count === 0 || count > (ptrEnd - ptr)) {
                            throw new BadHDRFileError(`Bad non-run scanline ${y} data: ptr=${ptr} ptrEnd=${ptrEnd} count=${count}, buf[0]=${rleBuffer[0]}, buf[1]=${rleBuffer[1]}`);
                        }

                        scanlineBuffer[ptr++] = rleBuffer[1];
                        if (--count > 0) {
                            if (data.read(count, scanlineBuffer) < count) {
                                throw new BadHDRFileError(`Read error on non-run scanline ${y} data: ptr=${ptr} ptrEnd=${ptrEnd} count=${count}, buf[0]=${rleBuffer[0]}, buf[1]=${rleBuffer[1]}`);
                            }
                            ptr += count;
                        }

                    }

                }

            }

            // convert data
            for (let i = 0; i < scanlineWidth; i++) {
                rgbeBuffer[0] = scanlineBuffer[i];
                rgbeBuffer[1] = scanlineBuffer[i + scanlineWidth];
                rgbeBuffer[2] = scanlineBuffer[i + 2 * scanlineWidth];
                rgbeBuffer[3] = scanlineBuffer[i + 3 * scanlineWidth];

                this.RGBEtoFloat(rgbeBuffer, 0, dst, dstOffset);
                dstOffset += 3;
            }

            numScanlines--;
        }
    }

}