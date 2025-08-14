import { TexturePackerVec4Shader } from '../../../../../shaders/util/texture-packer/texture-packer-vec4-shader';
import { RenderPipeline } from '../../render-pipeline';

export class TexturePackingVec4Pipeline extends RenderPipeline {
	gpuShader = new TexturePackerVec4Shader('Texture packing vec4 shader');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	async initialize() {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline();
	}

	private buildPipeline() {
		return device.createRenderPipelineAsync({
			label: 'mipmap pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [{ format: 'rgba8unorm' as GPUTextureFormat }],
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
					clearValue: { r: 0, g: 0, b: 0, a: 1 },
					loadOp: 'clear',
					storeOp: 'store',
				} as GPURenderPassColorAttachment,
			],
		} as GPURenderPassDescriptor;
	}
}
