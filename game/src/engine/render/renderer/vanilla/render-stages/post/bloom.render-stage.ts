import { BloomDownsamplePipeline } from ':engine/render/pipeline/post/bloom-downsample.pipeline';
import { BloomUpsamplePipeline } from ':engine/render/pipeline/post/bloom-upsample.pipeline';
import type { RenderResourcePool } from '../../render-resource-pool';
import type { RenderStage } from '../render-stage';

export class RenderStageBloom implements RenderStage {
	private readonly _downsamplePipeline = new BloomDownsamplePipeline();
	private readonly _upsamplePipeline = new BloomUpsamplePipeline();

	async initialize(pool: RenderResourcePool) {
		await this._downsamplePipeline.initialize(pool);
		await this._upsamplePipeline.initialize(pool);
	}

	private renderDownsamples(pool: RenderResourcePool) {
		for (let i = 0; i < pool.bloomMipsLength; i++) {
			const sourceTexture =
				i === 0
					? pool.hdrBufferChain.current.view
					: pool.bloomMips.texture.createView({
							mipLevelCount: 1,
							baseMipLevel: i - 1,
						});

			const targetMip = pool.bloomMips.texture.createView({
				mipLevelCount: 1,
				baseMipLevel: i,
			});

			this._downsamplePipeline.defineColorRenderAttachment(0, targetMip);
			const rpe = pool.commandEncoder.beginRenderPass(this._downsamplePipeline.gpuRenderPassDescriptor);

			rpe.setPipeline(this._downsamplePipeline.gpuPipeline);
			this._downsamplePipeline.bindSourceTexture(sourceTexture, rpe);
			this._downsamplePipeline.render(pool, rpe);
			rpe.end();
		}
	}

	private renderUpsamples(pool: RenderResourcePool) {
		for (let i = pool.bloomMipsLength - 1; i > 0; i--) {
			const sourceTexture = pool.bloomMips.texture.createView({
				mipLevelCount: 1,
				baseMipLevel: i,
			});

			const targetMip = pool.bloomMips.texture.createView({
				mipLevelCount: 1,
				baseMipLevel: i - 1,
			});

			this._upsamplePipeline.defineColorRenderAttachment(0, targetMip);
			const rpe = pool.commandEncoder.beginRenderPass(this._upsamplePipeline.gpuRenderPassDescriptor);

			rpe.setPipeline(this._upsamplePipeline.gpuPipeline);
			this._upsamplePipeline.bindSourceTexture(sourceTexture, rpe);
			this._upsamplePipeline.render(pool, rpe);
			rpe.end();
		}
	}

	render(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('Bloom Renderer');

		pool.commandEncoder.pushDebugGroup('Downsampler');
		this.renderDownsamples(pool);
		pool.commandEncoder.popDebugGroup();

		pool.commandEncoder.pushDebugGroup('Upsampler');
		this.renderUpsamples(pool);
		pool.commandEncoder.popDebugGroup();

		pool.commandEncoder.popDebugGroup();
	}
}
