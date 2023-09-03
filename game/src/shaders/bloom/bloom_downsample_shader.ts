import { Shader } from "../shader";
import shaderSource from "./bloom_downsample.wgsl";

export class BloomDownsampleShader extends Shader {

    static UNIFORM_BINDING_GROUPS = {
        FRAGMENT_TEXTURE: 0
    }

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }

}