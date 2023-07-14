import { Shader } from "../shader";
import shaderSource from './pbr.wgsl';

export class PBRShader extends Shader {

    static UNIFORM_BINDING_GROUPS = {
        VERTEX_VIEWPROJ: 0,
        VERTEX_MODEL: 1
    }

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }

}