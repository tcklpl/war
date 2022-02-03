import { Vec4 } from "../../data_formats/vec/vec4";

export interface ISolidColorUniforms {
    color: Vec4;
}

export interface ISolidColorUniformLocation {
    color: WebGLUniformLocation;
}