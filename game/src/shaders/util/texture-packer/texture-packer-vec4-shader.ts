import { Shader } from '../../shader';
import shaderSource from './texture-packer-vec4.wgsl?raw';

export class TexturePackerVec4Shader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURE: 0,
	};
}
