import { Shader } from '../../shader';
import shaderSource from './bloom-upsample.wgsl?raw';

export class BloomUpsampleShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		TEXTURE: 0,
	};
}
