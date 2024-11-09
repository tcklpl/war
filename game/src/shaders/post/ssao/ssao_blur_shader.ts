import { Shader } from '../../shader';
import shaderSource from './ssao_blur.wgsl';

export class SSAOBlurShader extends Shader {
    static readonly BINDING_GROUPS = {
        TEXTURES: 0,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }
}
