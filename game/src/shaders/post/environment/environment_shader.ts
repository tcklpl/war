import { Shader } from '../../shader';
import shaderSource from './environment.wgsl';

export class EnvironmentShader extends Shader {
    static BINDING_GROUPS = {
        TEXTURES: 0,
        SCENE: 1,
        VARIABLES: 2,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }
}
