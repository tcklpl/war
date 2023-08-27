import { Shader } from "../shader";
import shaderSource from './principled_bsdf.wgsl';

export class PrincipledBSDFShader extends Shader {

    static UNIFORM_BINDING_GROUPS = {
        VERTEX_VIEWPROJ: 0,
        VERTEX_MODEL: 1,
        FRAGMENT_MATERIAL: 2,
        FRAGMENT_LIGHTS: 3
    }

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }

}