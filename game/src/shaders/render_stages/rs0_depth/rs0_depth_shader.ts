import { Shader } from '../../shader';
import shaderSource from './rs0_depth.wgsl';

export class RS0DepthShader extends Shader {

    static UNIFORM_BINDING_GROUPS = {
        VERTEX_VIEWPROJ: 0,
        VERTEX_MODEL: 1
    }

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }

}