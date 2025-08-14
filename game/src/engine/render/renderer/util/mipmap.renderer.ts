import { MipmapPipeline } from ':engine/render/pipeline/util/mipmap.pipeline';
import { Mipmap2DShader } from '../../../../shaders/util/mipmap/mipmap-shader';

export class MipmapRenderer {
	private readonly _pipeline = new MipmapPipeline();
	private readonly _sampler = device.createSampler({
		label: 'cubemap convolution sampler',
		magFilter: 'linear',
		minFilter: 'linear',
		mipmapFilter: 'linear',
	});

	async initialize() {
		await this._pipeline.initialize();
	}

	/**
	 * Populates a GPUTexture's mip maps. This function also takes in consideration textures with multiple layers.
	 * @param source The texture to generate the mip maps.
	 */
	async generateMipMaps(source: GPUTexture) {
		// populate all mips starting on 1, as 0 is the texture itself
		for (let mip = 1; mip < source.mipLevelCount; mip++) {
			// considering textures with multiple layers, like cubes
			for (let face = 0; face < source.depthOrArrayLayers; face++) {
				// pass source image, this will be the original image on the first mip and the previous mip elsewhere
				const passSource = source.createView({
					baseMipLevel: mip - 1,
					mipLevelCount: 1,
					baseArrayLayer: face,
					arrayLayerCount: 1,
					dimension: '2d',
				});

				// create a bind group to hold the source of this pass
				const texBindGroup = device.createBindGroup({
					label: 'cube mipmap texture bind group',
					layout: this._pipeline.gpuPipeline.getBindGroupLayout(Mipmap2DShader.BINDING_GROUPS.TEXTURE),
					entries: [
						{ binding: 0, resource: this._sampler },
						{ binding: 1, resource: passSource },
					],
				});

				// render target as the current mip
				const renderTarget = source.createView({
					baseMipLevel: mip,
					mipLevelCount: 1,
					baseArrayLayer: face,
					arrayLayerCount: 1,
				});

				// encode the mip render and submit it to the GPU queue
				const commandEncoder = device.createCommandEncoder();
				this._pipeline.defineColorRenderAttachment(0, renderTarget);
				const rpe = this._pipeline.beginRenderPassAndSetPipeline(commandEncoder);
				rpe.setBindGroup(Mipmap2DShader.BINDING_GROUPS.TEXTURE, texBindGroup);
				rpe.draw(6);
				rpe.end();

				device.queue.submit([commandEncoder.finish()]);
			}
		}

		await device.queue.onSubmittedWorkDone();
	}

	free() {
		// Nothing to free here
	}
}
