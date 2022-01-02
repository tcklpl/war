import { Game } from "../game";

export interface MaterialLocation {
    albedo: WebGLUniformLocation;
    normal: WebGLUniformLocation;
}

export class Material {

    private _name: string;
    private albedoMap: WebGLTexture;
    private normalMap: WebGLTexture;
    private gl: WebGL2RenderingContext;

    constructor(name: string, albedo: HTMLImageElement, normal: HTMLImageElement) {
        this._name = name;
        this.gl = Game.instance.getGL();
        
        let tmpAlbedo = this.gl.createTexture();
        if (!tmpAlbedo) throw `Failed to allocate albedo texture map when creating material '${name}'`;
        this.albedoMap = tmpAlbedo;
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.albedoMap);
        this.setTextureProperties();
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, albedo);

        let tmpNormal = this.gl.createTexture();
        if (!tmpNormal) throw `Failed to allocate normal texture map when creating material '${name}'`;
        this.normalMap = tmpNormal;
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalMap);
        this.setTextureProperties();
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, normal);
    }

    private setTextureProperties() {
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    }

    bind(loc: MaterialLocation) {
        this.gl.uniform1i(loc.albedo, 0);
        this.gl.uniform1i(loc.normal, 1);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.albedoMap);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalMap);
    }

    public get name() {
        return this._name;
    }
}