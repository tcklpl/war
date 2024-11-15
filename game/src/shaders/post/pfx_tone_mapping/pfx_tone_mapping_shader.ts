import { Shader } from '../../shader';
import shaderSource from './pfx_tone_mapping.wgsl?raw';

export class PFXTonemapShader extends Shader {
    static readonly BINDING_GROUPS = {
        TEXTURES: 0,
        OPTIONS: 1,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }
}
