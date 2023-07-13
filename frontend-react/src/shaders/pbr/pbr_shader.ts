import { Shader } from "../shader";
import shaderSource from './pbr.wgsl';

export class PBRShader extends Shader {

    static UNIFORM_BINDING_GROUPS = {
        VERTEX_VIEWPROJ: 0,
        VERTEX_MODEL: 1
    }

    constructor(name: string) {
        super(name);
        console.log(shaderSource);
        this.compileShader(shaderSource);
    }

}