import { Shader } from "../../shader";
import shaderSource from './picking.wgsl';

export class PickingShader extends Shader {

    static BINDING_GROUPS = {
        VIEWPROJ: 0,
        ENTITY: 1
    }

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }

}