import { Shader } from '../../shader';
import shaderSource from './depth.wgsl';

export class DepthShader extends Shader {
    static BINDING_GROUPS = {
        VIEWPROJ: 0,
        MODEL: 1,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }
}
