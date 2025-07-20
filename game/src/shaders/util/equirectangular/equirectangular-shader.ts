import { Shader } from '../../shader';
import shaderSource from './equirectangular.wgsl?raw';

export class EquirectangularShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		VIEWPROJ: 0,
		TEXTURE: 1,
	};
}
