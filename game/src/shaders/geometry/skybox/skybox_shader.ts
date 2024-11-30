import vsCommonUniforms from '../../common/vs_common_uniforms.wgsl?raw';
import { Shader } from '../../shader';
import shaderSource from './skybox.wgsl?raw';

export class SkyboxShader extends Shader {
    static readonly BINDING_GROUPS = {
        VIEWPROJ: 0,
        TEXTURE: 1,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        const source = ''.concat(vsCommonUniforms, shaderSource);
        this.compileShader(source).then(() => cb());
    }
}
