import { Shader } from '../../shader';
import shaderSource from './prefilter_cubemap.wgsl';

export class PrefilterCubemapShader extends Shader {
    static BINDING_GROUPS = {
        VIEWPROJ: 0,
        TEXTURE: 1,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }
}
