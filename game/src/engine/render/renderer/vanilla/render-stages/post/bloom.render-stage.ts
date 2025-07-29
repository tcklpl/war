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

	render(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('Bloom Renderer');

		pool.commandEncoder.pushDebugGroup('Downsampler');
		this._downsamplePipeline.render(pool);
		pool.commandEncoder.popDebugGroup();

		pool.commandEncoder.pushDebugGroup('Upsampler');
		this._upsamplePipeline.render(pool);
		pool.commandEncoder.popDebugGroup();

		pool.commandEncoder.popDebugGroup();
	}
}
