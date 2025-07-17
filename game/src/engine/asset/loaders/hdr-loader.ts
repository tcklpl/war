export interface HDRImageData {
	width: number;
	height: number;
	exposure: number;
	gamma: number;
	data: Float32Array;
}

type Header = {
	width: number;
	height: number;
	gamma: number;
	exposure: number;
	colorCorr: number[];
	flipX: boolean;
	flipY: boolean;
};

type DataStream = {
	offset: number;
	data: DataView;
};

/**
 * This loader was adapted from io-rgbe by David Lenaerts (https://github.com/DerSchmale/io-rgbe/).
 *
 * Changes I made to the decoder:
 *  - Changed the returned Float32Array to also contain an alpha pixel 1.0. Thus making the length 4 * width * height;
 *  - Made the decoder invert the Y axis on "-Y" instead of "+Y"; and
 *  - Put the functions inside a class and made all of them private except for "decodeRGBE".
 *
 * MIT License
 *
 * Copyright (c) 2020 David Lenaerts
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
export class HDRLoader {
	decodeRGBE(data: DataView): HDRImageData {
		const stream = {
			data,
			offset: 0,
		};

		const header = this.parseHeader(stream);

		return {
			width: header.width,
			height: header.height,
			exposure: header.exposure,
			gamma: header.gamma,
			data: this.parseData(stream, header),
		};
	}

	private parseHeader(stream: DataStream): Header {
		let line = this.readLine(stream);
		const header = {
			colorCorr: [1, 1, 1],
			exposure: 1,
			gamma: 1,
			width: 0,
			height: 0,
			flipX: false,
			flipY: false,
		};

		if (line !== '#?RADIANCE' && line !== '#?RGBE') throw new Error('Incorrect file format!');

		while (line !== '') {
			// empty line means there's only 1 line left, containing size info:
			line = this.readLine(stream);
			const parts = line.split('=');
			switch (parts[0]) {
				case 'GAMMA':
					header.gamma = Number.parseFloat(parts[1]);
					break;
				case 'FORMAT':
					if (parts[1] !== '32-bit_rle_rgbe' && parts[1] !== '32-bit_rle_xyze')
						throw new Error('Incorrect encoding format!');
					break;
				case 'EXPOSURE':
					header.exposure = Number.parseFloat(parts[1]);
					break;
				case 'COLORCORR':
					header.colorCorr = parts[1]
						.replace(/^\s+|\s+$/g, '')
						.split(' ')
						.map(m => Number.parseFloat(m));
					break;
			}
		}

		line = this.readLine(stream);

		const parts = line.split(' ');
		this.parseSize(parts[0], Number.parseInt(parts[1]), header);
		this.parseSize(parts[2], Number.parseInt(parts[3]), header);

		return header;
	}

	private parseSize(label: string, value: number, header: Header) {
		switch (label) {
			case '+X':
				header.width = value;
				break;
			case '-X':
				header.width = value;
				header.flipX = true;
				break;
			case '-Y':
				header.height = value;
				header.flipY = true;
				break;
			case '+Y':
				header.height = value;
				break;
		}
	}

	private readLine(stream: DataStream): string {
		let ch: number;
		let str = '';

		while ((ch = stream.data.getUint8(stream.offset++)) !== 0x0a) str += String.fromCharCode(ch);

		return str;
	}

	private parseData(stream: DataStream, header: Header): Float32Array {
		const hash = stream.data.getUint16(stream.offset);
		let data: Float32Array;

		if (hash === 0x0202) {
			data = this.parseNewRLE(stream, header);
			if (header.flipX) this.flipX(data, header);
			if (header.flipY) this.flipY(data, header);
		} else {
			throw new Error('Obsolete HDR file version!');
		}

		return data;
	}

	private parseNewRLE(stream: DataStream, header: Header): Float32Array {
		const { width, height, colorCorr } = header;
		const tgt = new Float32Array(width * height * 4);
		let i = 0;
		let { offset } = stream;
		const { data } = stream;

		for (let y = 0; y < height; ++y) {
			if (data.getUint16(offset) !== 0x0202) throw new Error('Incorrect scanline start hash');
			if (data.getUint16(offset + 2) !== width) throw new Error("Scanline doesn't match picture dimension!");

			offset += 4;
			const numComps = width * 4;

			// read individual RLE components
			const comps = [];
			let x = 0;

			while (x < numComps) {
				let value = data.getUint8(offset++);
				if (value > 128) {
					// RLE:
					const len = value - 128;
					value = data.getUint8(offset++);
					for (let rle = 0; rle < len; ++rle) {
						comps[x++] = value;
					}
				} else {
					for (let n = 0; n < value; ++n) {
						comps[x++] = data.getUint8(offset++);
					}
				}
			}

			for (x = 0; x < width; ++x) {
				const r = comps[x];
				const g = comps[x + width];
				const b = comps[x + width * 2];
				let e = comps[x + width * 3];

				// NOT -128 but -136!!! This allows encoding smaller values rather than higher ones (as you'd expect).
				e = e ? 2.0 ** (e - 136) : 0;

				tgt[i++] = r * e * colorCorr[0];
				tgt[i++] = g * e * colorCorr[1];
				tgt[i++] = b * e * colorCorr[2];
				tgt[i++] = 1;
			}
		}

		return tgt;
	}

	private swap(data: Float32Array, pos1: number, pos2: number) {
		const i1 = pos1 * 4;
		const i2 = pos2 * 4;

		for (let i = 0; i < 4; ++i) {
			const tmp = data[i1 + i];
			data[i1 + i] = data[i2 + i];
			data[i2 + i] = tmp;
		}
	}

	private flipX(data: Float32Array, header: Header) {
		const { width, height } = header;
		const hw = width >> 1;

		for (let y = 0; y < height; ++y) {
			// selects the current row
			const b = y * width;
			for (let x = 0; x < hw; ++x) {
				// add the mirrored columns
				const i1 = b + x;
				const i2 = b + width - 1 - x;
				this.swap(data, i1, i2);
			}
		}
	}

	private flipY(data: Float32Array, header: Header) {
		const { width, height } = header;
		const hh = height >> 1;

		for (let y = 0; y < hh; ++y) {
			// selects the mirrored rows
			const b1 = y * width;
			const b2 = (height - 1 - y) * width;

			for (let x = 0; x < width; ++x) {
				// adds the column
				this.swap(data, b1 + x, b2 + x);
			}
		}
	}
}
