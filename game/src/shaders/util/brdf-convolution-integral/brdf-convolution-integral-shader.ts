import { Shader } from '../../shader';
import shaderSource from './brdf-convolution-integral.wgsl?raw';

export class BRDFConvolutionIntegralShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {};
}
