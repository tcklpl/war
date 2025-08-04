import { EnvironmentPipeline } from ':engine/render/pipeline/post/environment.pipeline';
import type { RenderResourcePool } from '../../render-resource-pool';
import type { RenderStage } from '../render-stage';

export class RenderStageEnvironment implements RenderStage {
	private readonly _pipeline = new EnvironmentPipeline();

	async initialize(pool: RenderResourcePool) {
		await this._pipeline.initialize(pool);
	}

	render(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('Environment Renderer');

		this._pipeline.updateEnvironmentVariablesBuffer(pool);
		this._pipeline.defineRenderAttachments(pool);
		const rpe = pool.commandEncoder.beginRenderPass(this._pipeline.gpuRenderPassDescriptor);

		rpe.setPipeline(this._pipeline.gpuPipeline);
		this._pipeline.bindBindGroups(rpe, pool);
		this._pipeline.render(pool, rpe);
		rpe.end();

		pool.commandEncoder.popDebugGroup();
	}

	free() {
		this._pipeline.free();
	}
}
