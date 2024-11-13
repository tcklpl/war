import { Shader } from '../../shader';
import shaderSource from './prefilter_cubemap.wgsl?raw';

export class PrefilterCubemapShader extends Shader {
    static readonly BINDING_GROUPS = {
        VIEWPROJ: 0,
        TEXTURE: 1,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }
}
