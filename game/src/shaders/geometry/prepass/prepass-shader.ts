import vsCommonUniforms from '../../common/vs-common-uniforms.wgsl?raw';
import vsUniqueUniforms from '../../common/vs-unique-uniforms.wgsl?raw';
import { Shader } from '../../shader';
import shaderSource from './prepass.wgsl?raw';

export class PrepassShader extends Shader {
	protected _source = ''.concat(vsCommonUniforms, vsUniqueUniforms, shaderSource);

	static readonly BINDING_GROUPS = {
		VIEW_PROJ: 0,
		MODEL: 1,
	};
}
