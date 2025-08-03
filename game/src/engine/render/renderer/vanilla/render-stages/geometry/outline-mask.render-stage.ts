import { EntityFlag } from ':engine/data/entity/entity-flag';
import { OutlineMaskPipeline } from ':engine/render/pipeline/geometry/outline-mask.pipeline';
import type { RenderResourcePool } from '../../render-resource-pool';
import type { RenderStage } from '../render-stage';

export class RenderStageOutlineMask implements RenderStage {
	private readonly _pipelineCCW = new OutlineMaskPipeline();
	private readonly _pipelineCW = new OutlineMaskPipeline();

	async initialize(pool: RenderResourcePool) {
		await this._pipelineCCW.initialize(pool, 'ccw');
		await this._pipelineCW.initialize(pool, 'cw');
	}

	render(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('Outline Masking');

		const rpe = pool.commandEncoder.beginRenderPass(this._pipelineCCW.gpuRenderPassDescriptor);

		if (pool.scene.entitiesPerWindingOrder.ccw.length > 0) {
			this._pipelineCCW.defineRenderAttachments(pool);
			rpe.setPipeline(this._pipelineCCW.gpuPipeline);
			this._pipelineCCW.bindBindGroups(rpe, pool);
			this._pipelineCCW.render(
				rpe,
				pool.scene.entitiesPerWindingOrder.ccw.filter(e => e.hasFlag(EntityFlag.OUTLINE)),
			);
		}

		if (pool.scene.entitiesPerWindingOrder.cw.length > 0) {
			this._pipelineCW.defineRenderAttachments(pool);
			rpe.setPipeline(this._pipelineCW.gpuPipeline);
			this._pipelineCW.bindBindGroups(rpe, pool);
			this._pipelineCW.render(
				rpe,
				pool.scene.entitiesPerWindingOrder.cw.filter(e => e.hasFlag(EntityFlag.OUTLINE)),
			);
		}

		rpe.end();
		pool.commandEncoder.popDebugGroup();
	}
}
