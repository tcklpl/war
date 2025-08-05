import { TAAPipeline } from ':engine/render/pipeline/post/taa.pipeline';
import type { RenderResourcePool } from '../../render-resource-pool';
import type { RenderStage } from '../render-stage';

export class RenderStageTAA implements RenderStage {
	private readonly _taaPipeline = new TAAPipeline();

	async initialize(pool: RenderResourcePool) {
		await this._taaPipeline.initialize(pool);
	}

	render(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('TAA Renderer');

		this._taaPipeline.updateTextureBindGroup(pool);
		this._taaPipeline.defineRenderAttachments(pool);
		const rpe = pool.commandEncoder.beginRenderPass(this._taaPipeline.gpuRenderPassDescriptor);

		rpe.setPipeline(this._taaPipeline.gpuPipeline);
		this._taaPipeline.bindBindGroup(rpe);
		this._taaPipeline.render(pool, rpe);
		rpe.end();

		// update the hdr chain to notify the next render stages to use the antialiased texture as input
		pool.hdrBufferChain.swapCurrentBuffers();

		pool.commandEncoder.popDebugGroup();
	}
}
