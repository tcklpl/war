import { Shader } from '../../shader';
import shaderSource from './bloom-downsample.wgsl?raw';

export class BloomDownsampleShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURE: 0,
	};
}
