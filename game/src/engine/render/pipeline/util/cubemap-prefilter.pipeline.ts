import { PrefilterCubemapShader } from '../../../../shaders/util/cubemap-prefiltering/prefilter-cubemap-shader';
import { RenderPipeline } from '../render-pipeline';

export class CubemapPrefilterPipeline extends RenderPipeline {
	gpuShader = new PrefilterCubemapShader('cubemap prefilter shader');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	async initialize() {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline();
	}

	private buildPipeline() {
		return device.createRenderPipelineAsync({
			label: 'cubemap convolution pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [{ format: 'rgba16float' as GPUTextureFormat }],
			},
			primitive: {
				topology: 'triangle-list',
				cullMode: 'front',
			},
		});
	}

	private buildRenderPassDescriptor() {
		return {
			colorAttachments: [
				{
					// view: Assigned later
					clearValue: { r: 0, g: 0, b: 0, a: 1 },
					loadOp: 'clear',
					storeOp: 'store',
				} as GPURenderPassColorAttachment,
			],
		} as GPURenderPassDescriptor;
	}
}
