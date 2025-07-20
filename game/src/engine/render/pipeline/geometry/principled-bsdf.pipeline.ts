import { PrimitiveDrawOptions } from ':engine/data/meshes/primitive-draw-options';
import type { WindingOrder } from ':engine/data/meshes/winding-order';
import { SceneInfoBindGroupOptions } from ':engine/data/scene/scene-info-bind-group-options';
import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { PrincipledBSDFShader } from '../../../../shaders/geometry/principled-bsdf/principled-bsdf-shader';
import { GeometryRenderPipeline } from '../render-pipeline';

export class PrincipledBSDFPipeline extends GeometryRenderPipeline {
	gpuShader = new PrincipledBSDFShader('principled bsdf pipeline shader');
	gpuPipeline!: GPURenderPipeline;
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();
	sceneInfoBindGroupOptions!: SceneInfoBindGroupOptions;
	primitiveDrawOptions = new PrimitiveDrawOptions().includeAll();
	viewProjBindGroup!: GPUBindGroup;

	private readonly COLOR_ATTACHMENT_HDR_OUTPUT = 0;
	private readonly COLOR_ATTACHMENT_NORMAL_BUFFER = 1;
	private readonly COLOR_ATTACHMENT_SPECULAR_BUFFER = 2;

	async initialize(pool: RenderResourcePool, windingOrder: WindingOrder) {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline(pool, windingOrder);
		this.sceneInfoBindGroupOptions = new SceneInfoBindGroupOptions(PrincipledBSDFShader.BINDING_GROUPS.SCENE_INFO)
			.includeDirectionalLights(0)
			.includePointLights(1)
			.includeExtras([
				{
					binding: 2,
					resource: pool.shadowMapAtlas.texture.view,
				},
			]);
		this.viewProjBindGroup = this.buildViewProjBindGroup(pool);
	}

	private buildPipeline(pool: RenderResourcePool, windingOrder: WindingOrder) {
		return device.createRenderPipelineAsync({
			label: 'rs solid geometry pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
				buffers: [
					// position
					{
						arrayStride: 3 * 4,
						attributes: [
							{
								shaderLocation: 0,
								offset: 0,
								format: 'float32x3',
							},
						],
					},
					// uv
					{
						arrayStride: 2 * 4,
						attributes: [
							{
								shaderLocation: 1,
								offset: 0,
								format: 'float32x2',
							},
						],
					},
					// normals
					{
						arrayStride: 3 * 4,
						attributes: [
							{
								shaderLocation: 2,
								offset: 0,
								format: 'float32x3',
							},
						],
					},
					// tangents
					{
						arrayStride: 4 * 4,
						attributes: [
							{
								shaderLocation: 3,
								offset: 0,
								format: 'float32x4',
							},
						],
					},
				] as GPUVertexBufferLayout[],
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [
					{ format: pool.hdrTextureFormat }, // hdr buffer
					{ format: 'rgba8unorm' as GPUTextureFormat }, // view-space normal buffer
					{ format: 'rg16float' as GPUTextureFormat }, // specular and roughness
				],
				constants: {
					shader_quality: game.engine.config.graphics.shaderQuality,
					shadow_filtering: game.engine.config.graphics.shadowFiltering,
				},
			},
			primitive: {
				topology: 'triangle-list',
				cullMode: 'back',
				frontFace: windingOrder,
			},
			depthStencil: {
				depthWriteEnabled: false,
				depthCompare: 'equal',
				format: 'depth24plus',
			},
		});
	}

	private buildRenderPassDescriptor(): GPURenderPassDescriptor {
		return {
			label: 'principled bsdf pipeline render pass descriptor',
			colorAttachments: [
				// HDR Output
				{
					// view: undefined, Assigned later
					clearValue: { r: 0, g: 0, b: 0, a: 1 },
					loadOp: 'clear',
					storeOp: 'store',
				},
				// Normal Buffer Output
				{
					// view: undefined, Assigned later
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
					loadOp: 'clear',
					storeOp: 'store',
				},
				// Specular Buffer Output
				{
					// view: undefined, Assigned later
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
					loadOp: 'clear',
					storeOp: 'store',
				},
			] as GPURenderPassColorAttachment[],
			depthStencilAttachment: {
				// view: undefined, Assigned later
				depthReadOnly: true,
			} as GPURenderPassDepthStencilAttachment,
		};
	}

	private buildViewProjBindGroup(pool: RenderResourcePool) {
		return device.createBindGroup({
			label: 'PBR ViewProj',
			layout: this.gpuPipeline.getBindGroupLayout(PrincipledBSDFShader.BINDING_GROUPS.VIEW_PROJ),
			entries: [{ binding: 0, resource: { buffer: pool.viewProjBuffer } }],
		});
	}

	defineRenderAttachments(pool: RenderResourcePool): void {
		this.defineColorRenderAttachment(this.COLOR_ATTACHMENT_HDR_OUTPUT, pool.hdrBufferChain.current.view);
		this.defineColorRenderAttachment(this.COLOR_ATTACHMENT_NORMAL_BUFFER, pool.normalTextureView);
		this.defineColorRenderAttachment(this.COLOR_ATTACHMENT_SPECULAR_BUFFER, pool.specularTextureView);
		this.defineDepthRenderAttachment(pool.depthTextureView);
	}

	bindBindGroups(rpe: GPURenderPassEncoder, pool: RenderResourcePool) {
		rpe.setBindGroup(PrincipledBSDFShader.BINDING_GROUPS.VIEW_PROJ, this.viewProjBindGroup);

		const sceneInfoBindGroup = pool.scene.info.getBindGroup(this.gpuPipeline, this.sceneInfoBindGroupOptions);
		rpe.setBindGroup(PrincipledBSDFShader.BINDING_GROUPS.SCENE_INFO, sceneInfoBindGroup);
	}
}
