import { Mat4 } from ':engine/data/mat/mat4';
import { PrimitiveDrawOptions } from ':engine/data/meshes/primitive-draw-options';
import { SceneInfoBindGroupOptions } from ':engine/data/scene/scene-info-bind-group-options';
import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { DepthShader } from '../../../../shaders/geometry/depth/depth-shader';
import { BufferUtils } from '../../../../utils/buffer-utils';
import { GeometryRenderPipeline } from '../render-pipeline';

export class DepthPipeline extends GeometryRenderPipeline {
	gpuShader = new DepthShader('depth shader');
	primitiveDrawOptions = new PrimitiveDrawOptions().includePosition(0);
	sceneInfoBindGroupOptions = new SceneInfoBindGroupOptions(0);
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	private _viewProjBuffer!: GPUBuffer;
	private _viewProjBindGroup!: GPUBindGroup;

	async initialize() {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline();
		this._viewProjBuffer = this.buildViewProjBuffer();
		this._viewProjBindGroup = this.buildViewProjBindGroup();
	}

	private buildPipeline() {
		return device.createRenderPipelineAsync({
			label: 'rs ssao pipeline',
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
				targets: [],
			},
			primitive: {
				topology: 'triangle-list',
				cullMode: 'none',
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
			colorAttachments: [],
			depthStencilAttachment: {
				// view will be assigned later
				depthClearValue: 1,
				depthLoadOp: 'clear',
				depthStoreOp: 'store',
			} as GPURenderPassDepthStencilAttachment,
		} as GPURenderPassDescriptor;
	}

	private buildViewProjBuffer() {
		return BufferUtils.createEmptyBuffer(
			Mat4.byteSize,
			GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			'shadow map common buffer',
		);
	}

	private buildViewProjBindGroup() {
		return device.createBindGroup({
			label: 'PBR ViewProj',
			layout: this.gpuPipeline.getBindGroupLayout(DepthShader.BINDING_GROUPS.VIEW_PROJ),
			entries: [{ binding: 0, resource: { buffer: this._viewProjBuffer } }],
		});
	}

	writeToDepthCommonBuffer(mat: Mat4) {
		device.queue.writeBuffer(this._viewProjBuffer, 0, mat.toF32Array());
	}

	defineRenderAttachments(pool: RenderResourcePool) {
		this.defineDepthRenderAttachment(pool.shadowMapAtlas.texture.view);
	}

	bindBindGroups(rpe: GPURenderPassEncoder, _pool: RenderResourcePool) {
		rpe.setBindGroup(DepthShader.BINDING_GROUPS.VIEW_PROJ, this._viewProjBindGroup);
	}

	free() {
		this._viewProjBuffer.destroy();
	}
}
