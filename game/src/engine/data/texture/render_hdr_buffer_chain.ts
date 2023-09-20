import { Vec2 } from "../vec/vec2";
import { Texture } from "./texture"

export class RenderHDRBufferChain {

    private _textures = [
        new Texture(),
        new Texture(),
        new Texture()
    ];
    private _previous = 2;
    private _current = 0;
    private _available = 1;

    constructor(private _hdrFormat: GPUTextureFormat) { }

    private createHDRTexture(resolution: Vec2, label: string) {
        return device.createTexture({
            label: label,
            size: [resolution.x, resolution.y],
            format: this._hdrFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
    }

    swapCurrentAndPrevious() {
        const temp = this._previous;
        this._previous = this._current;
        this._current = temp;
    }

    swapCurrentBuffers() {
        const temp = this._current;
        this._current = this._available;
        this._available = temp;
    }

    resize(resolution: Vec2) {
        this.free();
        this._textures[0].texture = this.createHDRTexture(resolution, 'render pool: hdr texture 0');
        this._textures[1].texture = this.createHDRTexture(resolution, 'render pool: hdr texture 1');
        this._textures[2].texture = this.createHDRTexture(resolution, 'render pool: hdr texture 2');
    }

    free() {
        this._textures.forEach(t => t.free());
    }

    get previous() {
        return this._textures[this._previous];
    }

    get current() {
        return this._textures[this._current];
    }

    get available() {
        return this._textures[this._available];
    }

}