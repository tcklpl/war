import { PfxToneMappingPipeline } from ':engine/render/pipeline/post/pfx-tone-mapping.pipeline';
import type { RenderResourcePool } from '../../render-resource-pool';
import type { RenderStage } from '../render-stage';

export class RenderStagePFXToneMapping implements RenderStage {
	private readonly _pipeline = new PfxToneMappingPipeline();

	async initialize(pool: RenderResourcePool) {
		await this._pipeline.initialize(pool);
	}

	render(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('PFX and Tonemapper');

		this._pipeline.updateTextureBindGroup(pool);
		this._pipeline.defineRenderAttachments(pool);
		const rpe = pool.commandEncoder.beginRenderPass(this._pipeline.gpuRenderPassDescriptor);

		rpe.setPipeline(this._pipeline.gpuPipeline);
		this._pipeline.bindBindGroup(rpe);
		this._pipeline.render(pool, rpe);
		rpe.end();
		pool.commandEncoder.popDebugGroup();
	}

	free() {
		this._pipeline.free();
	}
}
