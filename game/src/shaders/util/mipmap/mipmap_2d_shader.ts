import { Shader } from "../../shader";
import shaderSource from "./2d_mipmap.wgsl";

export class Mipmap2DShader extends Shader {

    static BINDING_GROUPS = {
        TEXTURE: 0
    }

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }

}