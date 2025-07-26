import vsUniqueUniforms from '../../common/vs-unique-uniforms.wgsl?raw';
import { Shader } from '../../shader';
import shaderSource from './depth.wgsl?raw';

export class DepthShader extends Shader {
	protected _source = ''.concat(vsUniqueUniforms, shaderSource);

	static readonly BINDING_GROUPS = {
		VIEW_PROJ: 0,
		MODEL: 1,
	};
}
