import { Shader } from '../../shader';
import shaderSource from './outline.wgsl?raw';

export class OutlineShader extends Shader {
	static readonly BINDING_GROUPS = {
		TEXTURES: 0,
	};

	constructor(name: string, cb: () => void) {
		super(name);
		this.compileShader(shaderSource).then(() => cb());
	}
}
