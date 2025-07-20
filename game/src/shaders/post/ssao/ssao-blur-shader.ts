import { Shader } from '../../shader';
import shaderSource from './ssao-blur.wgsl?raw';

export class SSAOBlurShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURES: 0,
	};
}
