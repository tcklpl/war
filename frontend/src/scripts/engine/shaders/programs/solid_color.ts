import { Game } from "../../../game";
import { Vec4 } from "../../data_formats/vec/vec4";
import { ShaderProgram } from "../shader_program";
import { IShaderProgram } from "./i_shader_program";
import { ISolidColorUniformLocation, ISolidColorUniforms } from "./solid_color_uniforms";

export class SolidColorShaderProgram implements IShaderProgram {

    private _shaderUniforms!: ISolidColorUniforms;
    private _shaderUniformLocations!: ISolidColorUniformLocation;
    private _shaderProgram: ShaderProgram;

    constructor(program: ShaderProgram) {
        this._shaderProgram = program;
        this.fetchUniforms();
        this.instantiatePlaceholder();
    }

    private fetchUniforms() {
        this._shaderUniformLocations = {
            color: this._shaderProgram.getUniform('u_color')
        }
    }

    private instantiatePlaceholder() {
        this._shaderUniforms = {
            color: Vec4.fromValue(1)
        }
    }

    bindUniforms(): void {
        let gl = Game.instance.gl;
        this._shaderUniforms.color.setUniform(gl, this._shaderUniformLocations.color);
    }

    get uniforms() {
        return this._shaderUniforms;
    }

    public get program() {
        return this._shaderProgram;
    }
    
}