import vsCommonUniforms from '../../common/vs_common_uniforms.wgsl?raw';
import vsUniqueUniforms from '../../common/vs_unique_uniforms.wgsl?raw';
import { Shader } from '../../shader';
import shaderSource from './prepass.wgsl?raw';

export class PrepassShader extends Shader {
    static readonly BINDING_GROUPS = {
        VIEWPROJ: 0,
        MODEL: 1,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        const source = ''.concat(vsCommonUniforms, vsUniqueUniforms, shaderSource);
        this.compileShader(source).then(() => cb());
    }
}
