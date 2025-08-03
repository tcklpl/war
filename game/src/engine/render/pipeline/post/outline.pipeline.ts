import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { OutlineShader } from '../../../../shaders/post/outline/outline-shader';
import { RenderPipeline } from '../render-pipeline';

export class OutlinePipeline extends RenderPipeline {
	gpuShader = new OutlineShader('Outline');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	private _outlineBindGroup!: GPUBindGroup;

	async initialize(pool: RenderResourcePool) {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline();
		this.updateBindGroup(pool);
	}

	private buildPipeline() {
		return device.createRenderPipelineAsync({
			label: 'outline compute pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
				buffers: [] as GPUVertexBufferLayout[],
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [{ format: 'rgba8unorm' }],
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
				// Outline texture
				{
					// view: undefined, Assigned later
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
					loadOp: 'clear',
					storeOp: 'store',
				},
			] as GPURenderPassColorAttachment[],
		} as GPURenderPassDescriptor;
	}

	updateBindGroup(pool: RenderResourcePool) {
		this._outlineBindGroup = device.createBindGroup({
			layout: this.gpuPipeline.getBindGroupLayout(OutlineShader.BINDING_GROUPS.TEXTURES),
			entries: [{ binding: 0, resource: pool.outlineMaskView }],
		});
	}

	defineRenderAttachments(pool: RenderResourcePool) {
		this.defineColorRenderAttachment(0, pool.outlineTextureView);
	}

	bindBindGroups(rpe: GPURenderPassEncoder) {
		rpe.setBindGroup(OutlineShader.BINDING_GROUPS.TEXTURES, this._outlineBindGroup);
	}

	render(_pool: RenderResourcePool, rpe: GPURenderPassEncoder): void {
		rpe.draw(6);
	}
}
