import { Shader } from '../../shader';
import shaderSource from './texture_packer_vec4.wgsl?raw';

export class TexturePackerVec4Shader extends Shader {
    static readonly BINDING_GROUPS = {
        TEXTURE: 0,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }
}
