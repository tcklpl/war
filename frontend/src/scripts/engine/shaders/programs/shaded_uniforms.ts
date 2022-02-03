import { Texture } from "../../data_formats/texture";
import { UInteger } from "../../data_formats/uniformable_basics/u_integer";
import { ILightUniformLocation, ILightUniforms } from "./light_uniforms";
import { IMvp, IMvpLocation } from "./mvp_uniforms";
import { IShadowUniformLocation, IShadowUniforms } from "./shadow_uniforms";
import { IMaterialUniformLocation, IMaterialUniforms } from "./texture_maps_uniforms";

export interface IShadedUniforms {
    vertex: {
        mvp: IMvp;
    }
    fragment: {
        lights: ILightUniforms[];
        presentLights: UInteger;
        shadowAtlas: Texture;
        material: IMaterialUniforms;
    }
    shared: {
        shadows: IShadowUniforms[];
        presentShadows: UInteger;
    }
}

export interface IShadedUniformLocations {
    vertex: {
        mvp: IMvpLocation;
    }
    fragment: {
        lights: ILightUniformLocation[];
        presentLights: WebGLUniformLocation;
        shadowAtlas: WebGLUniformLocation;
        material: IMaterialUniformLocation;
    }
    shared: {
        shadows: IShadowUniformLocation[];
        presentShadows: WebGLUniformLocation;
    }
}