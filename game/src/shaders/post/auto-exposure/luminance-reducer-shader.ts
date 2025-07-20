import { Shader } from '../../shader';
import shaderSource from './luminance-reducer.wgsl?raw';

export class LuminanceReducerShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		DATA: 0,
	};
}
