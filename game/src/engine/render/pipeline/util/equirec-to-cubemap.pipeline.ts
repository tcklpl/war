import { EquirectangularShader } from '../../../../shaders/util/equirectangular/equirectangular-shader';
import { RenderPipeline } from '../render-pipeline';

export class EquirecToCubemapPipeline extends RenderPipeline {
	gpuShader = new EquirectangularShader('Equirectangular shader');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	constructor(private readonly _textureFormat: 'rgba16float' | 'rgba32float') {
		super();
	}

	async initialize() {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline();
	}

	private buildPipeline() {
		return device.createRenderPipelineAsync({
			label: 'equirec to cubemap pipeline',
			layout:
				this._textureFormat === 'rgba16float'
					? 'auto'
					: device.createPipelineLayout({
							label: 'equirec to cubemap pipeline layout',
							bindGroupLayouts: [
								device.createBindGroupLayout({
									entries: [
										{
											binding: 0,
											buffer: { type: 'uniform' },
											visibility: GPUShaderStage.VERTEX,
										},
									] as GPUBindGroupLayoutEntry[],
								}),
								device.createBindGroupLayout({
									entries: [
										{
											binding: 0,
											sampler: { type: 'non-filtering' },
											visibility: GPUShaderStage.FRAGMENT,
										},
										{
											binding: 1,
											texture: { sampleType: 'unfilterable-float' },
											visibility: GPUShaderStage.FRAGMENT,
										},
									] as GPUBindGroupLayoutEntry[],
								}),
							],
						}),
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
