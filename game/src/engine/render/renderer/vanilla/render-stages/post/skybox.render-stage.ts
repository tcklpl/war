import { SkyboxPipeline } from ':engine/render/pipeline/post/skybox.pipeline';
import type { RenderResourcePool } from '../../render-resource-pool';
import type { RenderStage } from '../render-stage';

export class RenderStageSkybox implements RenderStage {
	private readonly _pipeline = new SkyboxPipeline();

	async initialize(pool: RenderResourcePool) {
		await this._pipeline.initialize(pool);
	}

	render(pool: RenderResourcePool) {
		if (!pool.scene.activeSkybox) return;

		pool.commandEncoder.pushDebugGroup('Skybox Renderer');
		this._pipeline.defineRenderAttachments(pool);
		const rpe = pool.commandEncoder.beginRenderPass(this._pipeline.gpuRenderPassDescriptor);

		rpe.setPipeline(this._pipeline.gpuPipeline);
		const skyboxBindGroup = pool.scene.activeSkybox.getBindGroup(this._pipeline.gpuPipeline).skybox;
		this._pipeline.bindBindGroups(rpe, skyboxBindGroup);
		this._pipeline.render(pool, rpe);
		rpe.end();
		pool.commandEncoder.popDebugGroup();
	}
}
