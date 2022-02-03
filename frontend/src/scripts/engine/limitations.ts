
export class Limitations {

    private static _gl: WebGL2RenderingContext;

    public static set gl(gl: WebGL2RenderingContext) {
        this._gl = gl;
    }

    public static get maxTextureSize() {
        return this._gl.getParameter(this.gl.MAX_TEXTURE_SIZE) as number;
    }

}