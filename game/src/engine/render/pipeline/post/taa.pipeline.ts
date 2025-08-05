import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { TAAShader } from '../../../../shaders/post/taa/taa-shader';
import { RenderPipeline } from '../render-pipeline';

export class TAAPipeline extends RenderPipeline {
	gpuShader = new TAAShader('TAA Shader');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	private _textureBindGroup!: GPUBindGroup;

	private readonly _samplerNearest = device.createSampler({
		minFilter: 'nearest',
		magFilter: 'nearest',
	});
	private readonly _samplerLinear = device.createSampler({
		minFilter: 'linear',
		magFilter: 'linear',
	});

	async initialize(pool: RenderResourcePool) {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline(pool.hdrTextureFormat);
		this.updateTextureBindGroup(pool);
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

	updateTextureBindGroup(pool: RenderResourcePool) {
		this._textureBindGroup = device.createBindGroup({
			label: 'taa bind group',
			layout: this.gpuPipeline.getBindGroupLayout(TAAShader.BINDING_GROUPS.TEXTURES),
			entries: [
				{ binding: 0, resource: this._samplerNearest },
				{ binding: 1, resource: this._samplerLinear },
				{ binding: 2, resource: pool.hdrBufferChain.current.view },
				{ binding: 3, resource: pool.hdrBufferChain.previous.view },
				{ binding: 4, resource: pool.velocityTextureView },
			],
		});
	}

	defineRenderAttachments(pool: RenderResourcePool) {
		this.defineColorRenderAttachment(0, pool.hdrBufferChain.available.view);
	}

	bindBindGroup(rpe: GPURenderPassEncoder) {
		rpe.setBindGroup(TAAShader.BINDING_GROUPS.TEXTURES, this._textureBindGroup);
	}

	render(_pool: RenderResourcePool, rpe: GPURenderPassEncoder): void {
		rpe.draw(6);
	}
}
