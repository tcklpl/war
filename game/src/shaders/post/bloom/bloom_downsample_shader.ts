import { Shader } from '../../shader';
import shaderSource from './bloom_downsample.wgsl';

export class BloomDownsampleShader extends Shader {
    static BINDING_GROUPS = {
        TEXTURE: 0,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }
}
