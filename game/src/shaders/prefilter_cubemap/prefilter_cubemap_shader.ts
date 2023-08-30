import { Shader } from "../shader";
import shaderSource from './prefilter_cubemap.wgsl';

export class PrefilterCubemapShader extends Shader {

    static UNIFORM_BINDING_GROUPS = {
        VERTEX_VIEWPROJ: 0,
        FRAGMENT_TEXTURE: 1
    }

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }

}