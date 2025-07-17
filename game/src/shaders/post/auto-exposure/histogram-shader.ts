import { Shader } from '../../shader';
import shaderSource from './histogram.wgsl?raw';

export class HistogramShader extends Shader {
	static readonly BINDING_GROUPS = {
		DATA: 0,
	};

	constructor(name: string, cb: () => void) {
		super(name);
		this.compileShader(shaderSource).then(() => cb());
	}
}
