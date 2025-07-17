import { Shader } from '../../shader';
import shaderSource from './ssao.wgsl?raw';

export class SSAOShader extends Shader {
	static readonly BINDING_GROUPS = {
		TEXTURES: 0,
		OPT_KERNEL: 1,
	};

	constructor(name: string, cb: () => void) {
		super(name);
		this.compileShader(shaderSource).then(() => cb());
	}
}
