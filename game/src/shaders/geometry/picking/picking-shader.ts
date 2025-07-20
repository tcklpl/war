import vsUniqueUniforms from '../../common/vs-unique-uniforms.wgsl?raw';
import { Shader } from '../../shader';
import shaderSource from './picking.wgsl?raw';

export class PickingShader extends Shader {
	protected _source = ''.concat(vsUniqueUniforms, shaderSource);

	static readonly BINDING_GROUPS = {
		VIEWPROJ: 0,
		ENTITY: 1,
	};
}
