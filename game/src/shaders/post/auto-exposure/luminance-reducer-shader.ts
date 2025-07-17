import { Shader } from '../../shader';
import shaderSource from './luminance-reducer.wgsl?raw';

export class LuminanceReducerShader extends Shader {
	static readonly BINDING_GROUPS = {
		DATA: 0,
	};

	constructor(name: string, cb: () => void) {
		super(name);
		this.compileShader(shaderSource).then(() => cb());
	}
}
