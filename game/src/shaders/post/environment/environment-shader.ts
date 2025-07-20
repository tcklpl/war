import { Shader } from '../../shader';
import shaderSource from './environment.wgsl?raw';

export class EnvironmentShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURES: 0,
		SCENE: 1,
		VARIABLES: 2,
	};
}
