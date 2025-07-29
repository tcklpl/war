import { PrepassPipeline } from ':engine/render/pipeline/geometry/prepass.pipeline';
import type { RenderResourcePool } from '../render-resource-pool';
import type { RenderStage } from './render-stage';

export class RenderStagePrePass implements RenderStage {
	private readonly _prepassPipelineCCW = new PrepassPipeline();
	private readonly _prepassPipelineCW = new PrepassPipeline();

	async initialize(pool: RenderResourcePool) {
		await this._prepassPipelineCCW.initialize(pool, 'ccw');
		await this._prepassPipelineCW.initialize(pool, 'cw');
	}

	render(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('Pre-pass Render Stage');
		const rpe = pool.commandEncoder.beginRenderPass(this._prepassPipelineCCW.gpuRenderPassDescriptor);

		if (pool.scene.entitiesPerWindingOrder.ccw.length > 0) {
			this._prepassPipelineCCW.defineRenderAttachments(pool);
			rpe.setPipeline(this._prepassPipelineCCW.gpuPipeline);
			this._prepassPipelineCCW.bindBindGroups(rpe);
			this._prepassPipelineCCW.render(rpe, pool.scene.entitiesPerWindingOrder.ccw);
		}

		if (pool.scene.entitiesPerWindingOrder.cw.length > 0) {
			this._prepassPipelineCW.defineRenderAttachments(pool);
			rpe.setPipeline(this._prepassPipelineCW.gpuPipeline);
			this._prepassPipelineCW.bindBindGroups(rpe);
			this._prepassPipelineCW.render(rpe, pool.scene.entitiesPerWindingOrder.cw);
		}

		rpe.end();
		pool.commandEncoder.popDebugGroup();
	}
}
