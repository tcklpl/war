import { UFloat } from "../../data_formats/uniformable_basics/u_float";
import { Vec3 } from "../../data_formats/vec/vec3";
import { Vec4 } from "../../data_formats/vec/vec4";

export interface ILightUniforms {
    reverseLightDirection: Vec3;
    color: Vec4;
    position: Vec3;
    intensity: UFloat;
}

export interface ILightUniformLocation {
    reverseLightDirection: WebGLUniformLocation;
    color: WebGLUniformLocation;
    position: WebGLUniformLocation;
    intensity: WebGLUniformLocation;
}