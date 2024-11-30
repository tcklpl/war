import vsUniqueUniforms from '../../common/vs_unique_uniforms.wgsl?raw';
import { Shader } from '../../shader';
import shaderSource from './picking.wgsl?raw';

export class PickingShader extends Shader {
    static readonly BINDING_GROUPS = {
        VIEWPROJ: 0,
        ENTITY: 1,
    };

    constructor(name: string, cb: () => void) {
        super(name);
        const source = ''.concat(vsUniqueUniforms, shaderSource);
        this.compileShader(source).then(() => cb());
    }
}
