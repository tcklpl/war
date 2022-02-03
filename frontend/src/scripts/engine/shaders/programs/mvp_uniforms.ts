import { Mat4 } from "../../data_formats/mat/mat4";

export interface IMvp {
    model: Mat4;
    view: Mat4;
    projection: Mat4;
}

export interface IMvpLocation {
    model: WebGLUniformLocation;
    view: WebGLUniformLocation;
    projection: WebGLUniformLocation;
}