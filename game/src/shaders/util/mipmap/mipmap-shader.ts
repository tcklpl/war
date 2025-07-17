import { Shader } from '../../shader';
import shaderSource from './mipmap.wgsl?raw';

export class Mipmap2DShader extends Shader {
	static readonly BINDING_GROUPS = {
		TEXTURE: 0,
	};

	constructor(name: string, cb: () => void) {
		super(name);
		this.compileShader(shaderSource).then(() => cb());
	}
}
