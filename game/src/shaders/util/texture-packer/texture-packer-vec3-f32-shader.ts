import { Shader } from '../../shader';
import shaderSource from './texture-packer-vec3-f32.wgsl?raw';

export class TexturePackerVec3f32Shader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURE: 0,
	};
}
