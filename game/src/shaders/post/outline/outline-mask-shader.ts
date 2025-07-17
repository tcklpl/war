import vsCommonUniforms from '../../common/vs-common-uniforms.wgsl?raw';
import vsUniqueUniforms from '../../common/vs-unique-uniforms.wgsl?raw';
import { Shader } from '../../shader';
import shaderSource from './outline-mask.wgsl?raw';

export class OutlineMaskShader extends Shader {
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
