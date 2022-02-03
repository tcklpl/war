import { Texture } from "../../data_formats/texture";

export interface IMaterialUniforms {
    albedo: Texture;
    normal: Texture;
}

export interface IMaterialUniformLocation {
    albedo: WebGLUniformLocation;
    normal: WebGLUniformLocation;
}