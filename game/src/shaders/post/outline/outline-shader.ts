import { Shader } from '../../shader';
import shaderSource from './outline.wgsl?raw';

export class OutlineShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURES: 0,
	};
}
