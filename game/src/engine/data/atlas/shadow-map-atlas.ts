import { Atlas } from './atlas';

export class ShadowMapAtlas extends Atlas {
	constructor(resolution: number) {
		super({
			label: 'shadow map atlas',
			format: 'depth24plus',
			resolution: resolution,
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
		});
	}
}
