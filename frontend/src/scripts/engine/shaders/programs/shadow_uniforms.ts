import { Mat4 } from "../../data_formats/mat/mat4";
import { Vec3 } from "../../data_formats/vec/vec3";

export interface IShadowUniforms {
    position: Vec3;
    textureMat: Mat4;
}

export interface IShadowUniformLocation {
    position: WebGLUniformLocation;
    textureMat: WebGLUniformLocation;
}