import { Shader } from '../../shader';
import shaderSource from './mipmap.wgsl?raw';

export class Mipmap2DShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURE: 0,
	};
}
