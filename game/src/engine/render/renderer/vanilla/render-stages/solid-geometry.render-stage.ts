import type { GeometryRenderPipeline } from ':engine/render/pipeline/render-pipeline';
import type { Renderable } from ':engine/traits/renderable.trait';
import type { Transformable } from ':engine/traits/transformable.trait';
import type { Constructor } from 'typeUtils';
import type { RenderResourcePool } from '../render-resource-pool';
import type { RenderStage } from './render-stage';

interface GeometryPipelineEntry {
	ccw: GeometryRenderPipeline;
	cw: GeometryRenderPipeline;
}

export class RenderStageSolidGeometry implements RenderStage {
	private readonly _constructedPipelines = new Map<Constructor<GeometryRenderPipeline>, GeometryPipelineEntry>();
	private readonly _renderPassPipelines = new Map<
		Constructor<GeometryRenderPipeline>,
		{ ccw: Renderable[]; cw: Renderable[] }
	>();

	private async getConstructedPipelineEntries(
		requiredPipeline: Constructor<GeometryRenderPipeline>,
		pool: RenderResourcePool,
	) {
		const existing = this._constructedPipelines.get(requiredPipeline);
		if (existing) return existing;

		const pipelineCCW = new requiredPipeline();
		const pipelineCW = new requiredPipeline();

		await pipelineCCW.initialize(pool, 'ccw');
		await pipelineCW.initialize(pool, 'cw');

		const entry = {
			ccw: pipelineCCW,
			cw: pipelineCW,
		} as GeometryPipelineEntry;

		this._constructedPipelines.set(requiredPipeline, entry);
		return entry;
	}

	private putRenderableIntoMap(renderable: Renderable & Transformable) {
		let separation = this._renderPassPipelines.get(renderable.pipeline);
		if (!separation) {
			separation = {
				ccw: [],
				cw: [],
			};
			this._renderPassPipelines.set(renderable.pipeline, separation);
		}
		const listToAdd = renderable.windingOrder === 'ccw' ? separation.ccw : separation.cw;
		listToAdd.push(renderable);
	}

	async render(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('Solid Geometry Renderer');

		this._renderPassPipelines.clear();
		pool.scene.entitiesToRender.forEach(e => this.putRenderableIntoMap(e));

		for (const [pipeline, renderables] of this._renderPassPipelines.entries()) {
			const pipelinesPerWindingOrder = await this.getConstructedPipelineEntries(pipeline, pool);

			pipelinesPerWindingOrder.ccw.defineRenderAttachments(pool);
			pipelinesPerWindingOrder.cw.defineRenderAttachments(pool);

			// We can use either render pass descriptor as they are the same
			const rpe = pool.commandEncoder.beginRenderPass(pipelinesPerWindingOrder.ccw.gpuRenderPassDescriptor);

			if (renderables.ccw.length > 0 && pipelinesPerWindingOrder.ccw.gpuPipeline) {
				rpe.setPipeline(pipelinesPerWindingOrder.ccw.gpuPipeline);
				pipelinesPerWindingOrder.ccw.bindBindGroups(rpe, pool);
				for (const renderable of renderables.ccw) {
					renderable.render(
						rpe,
						pipelinesPerWindingOrder.ccw.gpuPipeline,
						pipelinesPerWindingOrder.ccw.primitiveDrawOptions,
					);
				}
			}

			if (renderables.cw.length > 0 && pipelinesPerWindingOrder.cw.gpuPipeline) {
				rpe.setPipeline(pipelinesPerWindingOrder.cw.gpuPipeline);
				pipelinesPerWindingOrder.cw.bindBindGroups(rpe, pool);
				for (const renderable of renderables.cw) {
					renderable.render(
						rpe,
						pipelinesPerWindingOrder.cw.gpuPipeline,
						pipelinesPerWindingOrder.cw.primitiveDrawOptions,
					);
				}
			}

			rpe.end();
		}

		pool.commandEncoder.popDebugGroup();
	}
}
