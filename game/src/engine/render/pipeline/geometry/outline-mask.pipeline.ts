import { PrimitiveDrawOptions } from ':engine/data/meshes/primitive-draw-options';
import type { WindingOrder } from ':engine/data/meshes/winding-order';
import { SceneInfoBindGroupOptions } from ':engine/data/scene/scene-info-bind-group-options';
import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { OutlineMaskShader } from '../../../../shaders/post/outline/outline-mask-shader';
import { GeometryRenderPipeline } from '../render-pipeline';

export class OutlineMaskPipeline extends GeometryRenderPipeline {
	gpuShader = new OutlineMaskShader('Outline mask shader');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();
	primitiveDrawOptions = new PrimitiveDrawOptions().includePosition(0);
	sceneInfoBindGroupOptions = new SceneInfoBindGroupOptions(0);

	private _viewProjBindGroup!: GPUBindGroup;

	async initialize(pool: RenderResourcePool, windingOrder: WindingOrder) {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline(windingOrder);
		this._viewProjBindGroup = this.buildBindGroup(pool);
	}

	private buildPipeline(windingOrder: WindingOrder) {
		return device.createRenderPipelineAsync({
			label: 'outline mask pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
				buffers: [
					// position
					{
						arrayStride: 3 * 4,
						attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
					},
				] as GPUVertexBufferLayout[],
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [{ format: 'rgba8unorm' as GPUTextureFormat }],
			},
			primitive: {
				topology: 'triangle-list',
				cullMode: 'back',
				frontFace: windingOrder,
			},
		});
	}

	private buildRenderPassDescriptor() {
		return {
			colorAttachments: [
				// Outline mask
				{
					// view: undefined, Assigned later
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
					loadOp: 'clear',
					storeOp: 'store',
				},
			] as GPURenderPassColorAttachment[],
		} as GPURenderPassDescriptor;
	}

	private buildBindGroup(pool: RenderResourcePool) {
		return device.createBindGroup({
			label: 'PBR ViewProj',
			layout: this.gpuPipeline.getBindGroupLayout(OutlineMaskShader.BINDING_GROUPS.VIEW_PROJ),
			entries: [{ binding: 0, resource: { buffer: pool.viewProjBuffer } }],
		});
	}

	defineRenderAttachments(pool: RenderResourcePool): void {
		this.defineColorRenderAttachment(0, pool.outlineMaskView);
	}

	bindBindGroups(rpe: GPURenderPassEncoder, _pool: RenderResourcePool): void {
		rpe.setBindGroup(OutlineMaskShader.BINDING_GROUPS.VIEW_PROJ, this._viewProjBindGroup);
	}
}
