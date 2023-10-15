import { Float16Array } from "@petamoriken/float16";
import { HDRImageData } from "../engine/asset/loaders/hdr_loader";
import { Vec4 } from "../engine/data/vec/vec4";

export class TextureUtils {

    /**
     * Creates a 1x1 texture from a normalized ([0-1]) Vec4
     * @param v Normalized Vec4
     */
    static createTextureFromNormalizedVec4(v: Vec4) {

        const tex = device.createTexture({
            size: [1, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        });

        device.queue.writeTexture(
            { texture: tex },
            new Uint8Array(v.values.map(x => Math.round(x * 255))),
            { bytesPerRow: 4, rowsPerImage: 1 },
            { width: 1, height: 1 }
        );

        return tex;
    }

    static create1pxR16Texture(v: number) {

        const tex = device.createTexture({
            size: [1, 1],
            format: 'r16float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        });

        device.queue.writeTexture(
            { texture: tex },
            new Float16Array(v).buffer,
            { bytesPerRow: 2, rowsPerImage: 1 },
            { width: 1, height: 1 }
        );

        return tex;
    }

    static async createRGBA16fFromBitmap(data: ImageBitmap, width: number, height: number) {

        const tex = device.createTexture({
            size: [width, height],
            format: 'rgba16float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });

        device.queue.copyExternalImageToTexture(
            { source: data },
            { texture: tex, colorSpace: 'display-p3' },
            { width: width, height: height }
        );

        await device.queue.onSubmittedWorkDone();

        return tex;

    }

    static async createRGBA32fFromRGBEData(data: HDRImageData) {

        const tex = device.createTexture({
            size: [data.width, data.height],
            format: 'rgba32float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });

        device.queue.writeTexture(
            { texture: tex },
            data.data.buffer,
            { bytesPerRow: data.width * 16 },
            { width: data.width, height: data.height }
        );

        await device.queue.onSubmittedWorkDone();

        return tex;

    }

    static createBlackSkybox() {

        const skybox = device.createTexture({
            size: [1, 1, 6],
            dimension: '2d',
            format: 'rgba16float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        });

        for (let i = 0; i < 6; i++) {
            device.queue.writeTexture(
                { texture: skybox, origin: [0, 0, i] },
                new Float32Array([0, 0, 0, 0]),
                { bytesPerRow: 16, rowsPerImage: 1 },
                { width: 1, height: 1, depthOrArrayLayers: 1 }
            );
        }

        return skybox;
    }

}