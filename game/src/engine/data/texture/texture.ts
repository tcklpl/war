import { MissingTextureError } from "../../../errors/engine/data/missing_texture";

export class Texture {

    private _view?: GPUTextureView;

    constructor(private _tex?: GPUTexture) {
        this._view = _tex?.createView();
    }

    free() {
        this._tex?.destroy();
    }

    async generateBitmaps() {
        if (!this._tex) {
            console.warn(`Trying to generate bitmaps for a texture that isn't yet created`);
            return;
        }
        await game.engine.utilRenderers.mipmap.generateMipMaps(this._tex);
    }

    get view() {
        if (!this._view) throw new MissingTextureError(`Trying to get texture view before it was set`);
        return this._view;
    }

    get texture() {
        if (!this._tex) throw new MissingTextureError(`Trying to get texture before it was set`);
        return this._tex;
    }

    set texture(t: GPUTexture) {
        this.free();
        this._tex = t;
        this._view = this._tex.createView();
    }

}