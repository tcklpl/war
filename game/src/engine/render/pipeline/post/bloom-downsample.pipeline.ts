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

	private createBindGroup(texView: GPUTextureView) {
		return device.createBindGroup({
			label: 'bloom downsample bind group',
			layout: this.gpuPipeline.getBindGroupLayout(BloomDownsampleShader.BINDING_GROUPS.TEXTURE),
			entries: [
				{ binding: 0, resource: this._sampler },
				{ binding: 1, resource: texView },
			],
		});
	}

	render(pool: RenderResourcePool): void {
		for (let i = 0; i < pool.bloomMipsLength; i++) {
			const sourceTexture =
				i === 0
					? pool.hdrBufferChain.current.view
					: pool.bloomMips.texture.createView({
							mipLevelCount: 1,
							baseMipLevel: i - 1,
						});

			const targetMip = pool.bloomMips.texture.createView({
				mipLevelCount: 1,
				baseMipLevel: i,
			});

			this.defineColorRenderAttachment(0, targetMip);
			const rpe = pool.commandEncoder.beginRenderPass(this.gpuRenderPassDescriptor);

			rpe.setPipeline(this.gpuPipeline);
			rpe.setBindGroup(BloomDownsampleShader.BINDING_GROUPS.TEXTURE, this.createBindGroup(sourceTexture));
			rpe.draw(6);
			rpe.end();
		}
	}

	defineRenderAttachments(_pool: RenderResourcePool): void {
		throw new Error('Method not implemented.');
	}

	bindBindGroups(_rpe: GPURenderPassEncoder, _pool: RenderResourcePool): void {
		throw new Error('Method not implemented.');
	}
}
