import { TexturePackerVec3f32Shader } from '../../../../../shaders/util/texture-packer/texture-packer-vec3-f32-shader';
import { RenderPipeline } from '../../render-pipeline';

export class TexturePackingVec3F32Pipeline extends RenderPipeline {
	gpuShader = new TexturePackerVec3f32Shader('Texture packing vec3 + f32 shader');
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
