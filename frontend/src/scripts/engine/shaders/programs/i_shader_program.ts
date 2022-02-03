import { ShaderProgram } from "../shader_program";

export interface IShaderProgram {

    bindUniforms(): void;
    get uniforms(): any;
    get program(): ShaderProgram;
}