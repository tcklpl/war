import { Shader } from "../shader";
import shaderSource from "./pfx_tone_mapping.wgsl";

export class PFXTonemapShader extends Shader {

    static UNIFORM_BINDING_GROUPS = {
        FRAGMENT_TEXTURE: 0
    }

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }

}