import { PrimitiveDrawOptions } from ':engine/data/meshes/primitive-draw-options';
import type { WindingOrder } from ':engine/data/meshes/winding-order';
import { SceneInfoBindGroupOptions } from ':engine/data/scene/scene-info-bind-group-options';
import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { PrepassShader } from '../../../../shaders/geometry/prepass/prepass-shader';
import { GeometryRenderPipeline } from '../render-pipeline';

export class PrepassPipeline extends GeometryRenderPipeline {
	gpuShader = new PrepassShader('prepass shader');
	gpuPipeline!: GPURenderPipeline;
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();
	primitiveDrawOptions = new PrimitiveDrawOptions().includePosition(0);
	sceneInfoBindGroupOptions = new SceneInfoBindGroupOptions(0);
	viewProjBindGroup!: GPUBindGroup;

	private readonly COLOR_ATTACHMENT_VELOCITY = 0;

	constructor(private readonly _device: GPUDevice) {
		super();
	}

	async initialize(windingOrder: WindingOrder, viewProjBuffer: GPUBuffer) {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline(windingOrder);
		this.viewProjBindGroup = this.buildViewProjBindBuffer(viewProjBuffer);
	}

	private buildPipeline(windingOrder: WindingOrder) {
		return this._device.createRenderPipelineAsync({
			label: `rs pre pass ${windingOrder} pipeline`,
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
				targets: [{ format: 'rg16float' as GPUTextureFormat }],
			},
			primitive: {
				topology: 'triangle-list',
				cullMode: 'back',
				frontFace: windingOrder,
			},
			depthStencil: {
				depthWriteEnabled: true,
				depthCompare: 'less',
				format: 'depth24plus',
			},
		});
	}

	private buildRenderPassDescriptor() {
		return {
			colorAttachments: [
				// Velocity
				{
					// view will be assigned later
					loadOp: 'clear',
					storeOp: 'store',
				},
			] as GPURenderPassColorAttachment[],
			depthStencilAttachment: {
				// view will be assigned later
				depthClearValue: 1,
				depthLoadOp: 'clear',
				depthStoreOp: 'store',
			} as GPURenderPassDepthStencilAttachment,
		} as GPURenderPassDescriptor;
	}

	private buildViewProjBindBuffer(viewProjBuffer: GPUBuffer) {
		return this._device.createBindGroup({
			label: 'Prepasss pipeline view/proj bind group',
			layout: this.gpuPipeline.getBindGroupLayout(PrepassShader.BINDING_GROUPS.VIEW_PROJ),
			entries: [{ binding: 0, resource: { buffer: viewProjBuffer } }],
		});
	}

	defineRenderAttachments(depthTextureView: GPUTextureView, velocityTextureView: GPUTextureView): void {
		this.defineColorRenderAttachment(this.COLOR_ATTACHMENT_VELOCITY, velocityTextureView);
		this.defineDepthRenderAttachment(depthTextureView);
	}

	bindBindGroups(rpe: GPURenderPassEncoder): void {
		rpe.setBindGroup(PrepassShader.BINDING_GROUPS.VIEW_PROJ, this.viewProjBindGroup);
	}
}
