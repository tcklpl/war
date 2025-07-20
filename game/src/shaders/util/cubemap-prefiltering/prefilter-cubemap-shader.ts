import { Shader } from '../../shader';
import shaderSource from './prefilter-cubemap.wgsl?raw';

export class PrefilterCubemapShader extends Shader {
	protected _source = shaderSource;

	static readonly BINDING_GROUPS = {
		VIEWPROJ: 0,
		TEXTURE: 1,
	};
}
