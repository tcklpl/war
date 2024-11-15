import { Shader } from '../../shader';
import shaderSource from './bloom_downsample.wgsl?raw';

export class BloomDownsampleShader extends Shader {
    static readonly BINDING_GROUPS = {
        TEXTURE: 0,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }
}
