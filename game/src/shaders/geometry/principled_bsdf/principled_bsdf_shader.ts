import { Shader } from "../../shader";
import shaderSource from './principled_bsdf.wgsl';

export class PrincipledBSDFShader extends Shader {

    static BINDING_GROUPS = {
        VIEWPROJ: 0,
        MODEL: 1,
        MATERIAL: 2,
        SCENE_INFO: 3
    }

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }

}