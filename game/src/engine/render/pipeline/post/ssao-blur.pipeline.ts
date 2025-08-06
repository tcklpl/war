import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { SSAOBlurShader } from '../../../../shaders/post/ssao/ssao-blur-shader';
import { RenderPipeline } from '../render-pipeline';

export class SSAOBlurPipeline extends RenderPipeline {
	gpuShader = new SSAOBlurShader('SSAO blur');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	async initialize(_pool: RenderResourcePool) {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline();
	}

	private buildPipeline() {
		return device.createRenderPipelineAsync({
			label: 'rs ssao pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
				buffers: [],
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [{ format: 'r16float' as GPUTextureFormat }],
			},
			primitive: {
				topology: 'triangle-list',
				cullMode: 'none',
			},
		});
	}

	private buildRenderPassDescriptor() {
		return {
			colorAttachments: [
				{
					// view: undefined, Assigned later
					clearValue: { r: 0, g: 0, b: 0, a: 1 },
					loadOp: 'load',
					storeOp: 'store',
				},
			] as GPURenderPassColorAttachment[],
		} as GPURenderPassDescriptor;
	}

	render(_pool: RenderResourcePool, rpe: GPURenderPassEncoder): void {
		rpe.draw(6);
	}
}
