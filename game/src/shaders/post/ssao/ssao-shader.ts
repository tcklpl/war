import { Shader } from '../../shader';
import shaderSource from './ssao.wgsl?raw';

export class SSAOShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURES: 0,
		OPT_KERNEL: 1,
	};
}
