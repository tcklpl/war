import { Shader } from '../../shader';
import shaderSource from './brdf_convolution_integral.wgsl';

export class BRDFConvolutionIntegralShader extends Shader {
    static BINDING_GROUPS = {};

    constructor(name: string, cb: () => void) {
        super(name);
        this.compileShader(shaderSource).then(() => cb());
    }
}
