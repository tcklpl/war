import { Shader } from "../../shader";
import shaderSource from "./luminance_reducer.wgsl";

export class LuminanceReducerShader extends Shader {

    static BINDING_GROUPS = {
        DATA: 0
    }

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }

}