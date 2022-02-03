import { Game } from "../../game";
import { Atlas } from "../atlas/atlas";
import { Limitations } from "../limitations";
import { ShadowAtlasEntry } from "./shadow_atlas_entry";

export class ShadowMapAtlas extends Atlas<ShadowAtlasEntry> {

    private gl = Game.instance.gl;
    private texture!: WebGLTexture;
    private currentSize!: number;
    private framebuffer!: WebGLFramebuffer;

    constructor() {
        super(8, 8);
    }

    constructTexture(specificSize?: number) {
        let size = specificSize || Limitations.maxTextureSize / 2;
        if (size > Limitations.maxTextureSize) throw `Cannot create a shadow map atlas bigger than the maximum supported texture size`;
        this.currentSize = size;

        if (this.texture) this.gl.deleteTexture(this.texture);
        if (this.framebuffer) this.gl.deleteFramebuffer(this.framebuffer);

        let tempTex = this.gl.createTexture();
        if (!tempTex) throw `Failed to create shadow atlas texture`;
        this.texture = tempTex;
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.DEPTH_COMPONENT32F,
            this.currentSize,
            this.currentSize,
            0,
            this.gl.DEPTH_COMPONENT,
            this.gl.FLOAT,
            null
        );

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        let tempBuffer = this.gl.createFramebuffer();
        if (!tempBuffer) throw `Failed to create shadow atlas framebuffer`;
        this.framebuffer = tempBuffer;
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.texture, 0);
    }

    usingFramebuffer(f: () => void) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        f();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    bind(tex: WebGLUniformLocation, texChannel: number) {
        this.gl.uniform1i(tex, texChannel);
        this.gl.activeTexture(this.gl.TEXTURE0 + texChannel);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    }

}