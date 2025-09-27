import type { Scene } from ':engine/data/scene/scene.ts';
import { PrepassPipeline } from ':engine/render/pipeline/geometry/prepass.pipeline';

export class RenderStagePrePass {
	private readonly _prepassPipelineCCW = new PrepassPipeline(this._device);
	private readonly _prepassPipelineCW = new PrepassPipeline(this._device);

	constructor(private readonly _device: GPUDevice) {}

	async initialize(viewProjBuffer: GPUBuffer) {
		await this._prepassPipelineCCW.initialize('ccw', viewProjBuffer);
		await this._prepassPipelineCW.initialize('cw', viewProjBuffer);
	}

	render(
		commandEncoder: GPUCommandEncoder,
		scene: Scene,
		depthTexture: GPUTextureView,
		velocityTexture: GPUTextureView,
	) {
		commandEncoder.pushDebugGroup('Pre-pass Render Stage');
		this._prepassPipelineCCW.defineRenderAttachments(depthTexture, velocityTexture);
		const rpe = commandEncoder.beginRenderPass(this._prepassPipelineCCW.gpuRenderPassDescriptor);

		if (scene.entitiesPerWindingOrder.ccw.length > 0) {
			this._prepassPipelineCCW.defineRenderAttachments(depthTexture, velocityTexture);
			rpe.setPipeline(this._prepassPipelineCCW.gpuPipeline);
			this._prepassPipelineCCW.bindBindGroups(rpe);
			this._prepassPipelineCCW.render(rpe, scene.entitiesPerWindingOrder.ccw);
		}

		if (scene.entitiesPerWindingOrder.cw.length > 0) {
			this._prepassPipelineCW.defineRenderAttachments(depthTexture, velocityTexture);
			rpe.setPipeline(this._prepassPipelineCW.gpuPipeline);
			this._prepassPipelineCW.bindBindGroups(rpe);
			this._prepassPipelineCW.render(rpe, scene.entitiesPerWindingOrder.cw);
		}

		rpe.end();
		commandEncoder.popDebugGroup();
	}
}
