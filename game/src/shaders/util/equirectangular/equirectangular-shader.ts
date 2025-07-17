import { Shader } from '../../shader';
import shaderSource from './equirectangular.wgsl?raw';

export class EquirectangularShader extends Shader {
	static readonly BINDING_GROUPS = {
		VIEWPROJ: 0,
		TEXTURE: 1,
	};

	constructor(name: string, cb: () => void) {
		super(name);
		this.compileShader(shaderSource).then(() => cb());
	}
}
