import { Shader } from '../../shader';
import shaderSource from './pfx-tone-mapping.wgsl?raw';

export class PFXTonemapShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURES: 0,
		OPTIONS: 1,
	};
}
