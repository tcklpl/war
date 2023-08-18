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

    static createRGBA16fFromHDRBitmap(data: ImageBitmap, width: number, height: number) {

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

        return tex;

    }

}