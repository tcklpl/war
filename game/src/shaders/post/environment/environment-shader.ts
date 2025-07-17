import { Shader } from '../../shader';
import shaderSource from './environment.wgsl?raw';

export class EnvironmentShader extends Shader {
	static readonly BINDING_GROUPS = {
		TEXTURES: 0,
		SCENE: 1,
		VARIABLES: 2,
	};

	constructor(name: string, cb: () => void) {
		super(name);
		this.compileShader(shaderSource).then(() => cb());
	}
}
