import { OutlinePipeline } from ':engine/render/pipeline/post/outline.pipeline';
import type { RenderResourcePool } from '../../render-resource-pool';
import type { RenderStage } from '../render-stage';

export class RenderStageOutline implements RenderStage {
	private readonly _pipeline = new OutlinePipeline();

	async initialize(pool: RenderResourcePool) {
		await this._pipeline.initialize(pool);
	}

	render(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('Outline');

		this._pipeline.defineRenderAttachments(pool);
		const pass = pool.commandEncoder.beginRenderPass(this._pipeline.gpuRenderPassDescriptor);
		pass.setPipeline(this._pipeline.gpuPipeline);
		this._pipeline.bindBindGroups(pass);
		this._pipeline.render(pool, pass);
		pass.end();

		pool.commandEncoder.popDebugGroup();
	}

	onScreenResize(pool: RenderResourcePool) {
		this._pipeline.updateBindGroup(pool);
	}
}
