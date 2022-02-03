import { Game } from "../../game";
import { Mat4 } from "../data_formats/mat/mat4";
import { Texture } from "../data_formats/texture";
import { UBoolean } from "../data_formats/uniformable_basics/u_boolean";
import { UFloat } from "../data_formats/uniformable_basics/u_float";
import { Vec3 } from "../data_formats/vec/vec3";

export interface ShaderLightUniformLocations {
    color: WebGLUniformLocation;
    position: WebGLUniformLocation;
    intensity: WebGLUniformLocation;

    castsShadows: WebGLUniformLocation;

    shadowMap: WebGLUniformLocation;
    reverseLightDirection: WebGLUniformLocation;
    shadowMapTexMat: WebGLUniformLocation;
}

export class ShaderLightInfo {

    color: Vec3;
    position: Vec3;
    intensity: UFloat;
    
    castsShadows: UBoolean;

    shadowMap?: Texture;
    reverseLightDirection?: Vec3;
    shadowMapTexMat?: Mat4;

    private gl = Game.instance.getGL();

    constructor(color: Vec3, pos: Vec3, intensity: number, castsShadows: boolean, shadowMap?: Texture, revLightDir?: Vec3, shadowMapTexMat?: Mat4) {
        this.color = color;
        this.position = pos;
        this.intensity = new UFloat(intensity);
        this.castsShadows = new UBoolean(castsShadows);

        if (castsShadows) {
            if (!shadowMap || !revLightDir || !shadowMapTexMat) throw `Failed to create light casting shader info with insufficient args`;
            this.shadowMap = shadowMap;
            this.reverseLightDirection = revLightDir;
            this.shadowMapTexMat = shadowMapTexMat;
        }
    }

    bind(location: ShaderLightUniformLocations) {
        this.color.setUniform(this.gl, location.color);
        this.position.setUniform(this.gl, location.position);
        this.intensity.setUniform(this.gl, location.intensity);

        this.castsShadows.setUniform(this.gl, location.castsShadows);

        if (this.castsShadows.value) {
            this.shadowMap?.setUniform(this.gl, location.shadowMap);
            this.reverseLightDirection?.setUniform(this.gl, location.reverseLightDirection);
            this.shadowMapTexMat?.setUniform(this.gl, location.shadowMapTexMat);
        }
    }


}