import vsCommonUniforms from '../../common/vs-common-uniforms.wgsl?raw';
import { Shader } from '../../shader';
import shaderSource from './skybox.wgsl?raw';

export class SkyboxShader extends Shader {
	protected _source = ''.concat(vsCommonUniforms, shaderSource);

	static readonly BINDING_GROUPS = {
		VIEWPROJ: 0,
		TEXTURE: 1,
	};
}
