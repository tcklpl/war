import { BRDFConvolutionIntegralShader } from '../../../../shaders/util/brdf-convolution-integral/brdf-convolution-integral-shader';
import { RenderPipeline } from '../render-pipeline';

export class BRDFLUTPipeline extends RenderPipeline {
	gpuShader = new BRDFConvolutionIntegralShader('BRDF LUT shader');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	async initialize() {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline();
	}

	private buildPipeline() {
		return device.createRenderPipelineAsync({
			label: 'BRDF LUT pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [{ format: 'rg16float' as GPUTextureFormat }],
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
					// view: Assigned later
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
					loadOp: 'clear',
					storeOp: 'store',
				} as GPURenderPassColorAttachment,
			],
		} as GPURenderPassDescriptor;
	}
}
