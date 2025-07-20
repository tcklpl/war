import { Shader } from '../../shader';
import shaderSource from './histogram.wgsl?raw';

export class HistogramShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		DATA: 0,
	};
}
