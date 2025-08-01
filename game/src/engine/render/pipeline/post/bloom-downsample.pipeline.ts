import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { BloomDownsampleShader } from '../../../../shaders/post/bloom/bloom-downsample-shader';
import { RenderPipeline } from '../render-pipeline';

export class BloomDownsamplePipeline extends RenderPipeline {
	gpuShader = new BloomDownsampleShader('bloom downsample shader');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();
	private readonly _sampler = device.createSampler({
		addressModeU: 'clamp-to-edge',
		addressModeV: 'clamp-to-edge',
		minFilter: 'linear',
		magFilter: 'linear',
	});

	async initialize(pool: RenderResourcePool) {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline(pool.hdrTextureFormat);
	}

	private buildPipeline(hdrTextureFormat: GPUTextureFormat) {
		return device.createRenderPipelineAsync({
			label: 'rs bloom pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
				buffers: [] as GPUVertexBufferLayout[],
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [{ format: hdrTextureFormat }],
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

	private getBindGroup(texView: GPUTextureView) {
		return device.createBindGroup({
			label: 'bloom downsample bind group',
			layout: this.gpuPipeline.getBindGroupLayout(BloomDownsampleShader.BINDING_GROUPS.TEXTURE),
			entries: [
				{ binding: 0, resource: this._sampler },
				{ binding: 1, resource: texView },
			],
		});
	}

	bindSourceTexture(textureView: GPUTextureView, rpe: GPURenderPassEncoder) {
		rpe.setBindGroup(BloomDownsampleShader.BINDING_GROUPS.TEXTURE, this.getBindGroup(textureView));
	}

	render(_pool: RenderResourcePool, rpe: GPURenderPassEncoder): void {
		rpe.draw(6);
	}
}
