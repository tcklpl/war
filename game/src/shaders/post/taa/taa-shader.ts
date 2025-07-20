import { Shader } from '../../shader';
import shaderSource from './taa.wgsl?raw';

export class TAAShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURES: 0,
	};
}
