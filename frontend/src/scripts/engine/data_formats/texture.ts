import { Game } from "../../game";
import { IUniformable } from "../traits/uniformable";

export class Texture implements IUniformable {

    private static _placeholder: Texture;

    private image: WebGLTexture;
    private textureOffset: number = 0;

    constructor(image: WebGLTexture, textureOffset?: number) {
        this.image = image;
        this.textureOffset = textureOffset || 0;
    }

    setUniform(gl: WebGL2RenderingContext, to: WebGLUniformLocation): void {
        gl.uniform1i(to, this.textureOffset);
        gl.activeTexture(gl.TEXTURE0 + this.textureOffset);
        gl.bindTexture(gl.TEXTURE_2D, this.image);
    }

    static placeholder() {
        if (this._placeholder) return this._placeholder;
        let gl = Game.instance.gl;
        let tempTex = gl.createTexture();
        if (!tempTex) throw `Failed to create temp placeholder texture`;
        gl.bindTexture(gl.TEXTURE_2D, tempTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Float32Array([0, 0, 0, 1]));
        this._placeholder = new Texture(tempTex);
        return this._placeholder;
    }
}