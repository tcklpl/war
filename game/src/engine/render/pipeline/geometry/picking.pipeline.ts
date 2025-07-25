import { PrimitiveDrawOptions } from ':engine/data/meshes/primitive-draw-options';
import { SceneInfoBindGroupOptions } from ':engine/data/scene/scene-info-bind-group-options';
import { Texture } from ':engine/data/texture/texture';
import { PickingShader } from '../../../../shaders/geometry/picking/picking-shader';
import { BufferUtils } from '../../../../utils/buffer-utils';
import { Mat4 } from '../../../data/mat/mat4';
import { GeometryRenderPipeline } from '../render-pipeline';

export class PickingPipeline extends GeometryRenderPipeline {
	gpuShader = new PickingShader('picking shader');
	gpuPipeline!: GPURenderPipeline;
	primitiveDrawOptions = new PrimitiveDrawOptions().includePosition(0);
	sceneInfoBindGroupOptions = new SceneInfoBindGroupOptions(0);
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	private readonly _pickingTexture = new Texture();
	private _pickingViewProjBuffer!: GPUBuffer;
	private _pickingViewProjBindGroup!: GPUBindGroup;

	async initialize() {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline();
		this._pickingTexture.texture = this.buildPickingTexture();
		this._pickingViewProjBuffer = this.buildPickingViewProjBuffer();
		this._pickingViewProjBindGroup = this.buildPickingViewProjBindGroup();
	}

	private buildPipeline() {
		return device.createRenderPipelineAsync({
			label: 'rs picking pipeline',
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
				targets: [{ format: 'r32uint' as GPUTextureFormat }],
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
				// ID Output
				{
					// view: undefined, Assigned later
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
					loadOp: 'clear',
					storeOp: 'store',
				},
			] as GPURenderPassColorAttachment[],
		} as GPURenderPassDescriptor;
	}

	private buildPickingTexture() {
		return device.createTexture({
			size: [1, 1],
			format: 'r32uint',
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
		});
	}

	private buildPickingViewProjBuffer() {
		return BufferUtils.createEmptyBuffer(2 * Mat4.byteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
	}

	private buildPickingViewProjBindGroup() {
		return device.createBindGroup({
			label: 'Picking ViewProj',
			layout: this.gpuPipeline.getBindGroupLayout(PickingShader.BINDING_GROUPS.VIEW_PROJ),
			entries: [{ binding: 0, resource: { buffer: this._pickingViewProjBuffer } }],
		});
	}

	writeMatricesToBuffer(view: Mat4, projection: Mat4) {
		device.queue.writeBuffer(this._pickingViewProjBuffer, 0, view.toF32Array());
		device.queue.writeBuffer(this._pickingViewProjBuffer, Mat4.byteSize, projection.toF32Array());
	}

	defineRenderAttachments() {
		this.defineColorRenderAttachment(0, this._pickingTexture.view);
	}

	bindBindGroups(rpe: GPURenderPassEncoder) {
		rpe.setBindGroup(PickingShader.BINDING_GROUPS.VIEW_PROJ, this._pickingViewProjBindGroup);
	}

	copyPickingTextureToBuffer(buffer: GPUBuffer, commandEncoder: GPUCommandEncoder) {
		commandEncoder.copyTextureToBuffer(
			{ texture: this._pickingTexture.texture },
			{ buffer },
			{ width: 1, height: 1 },
		);
	}

	free() {
		this._pickingTexture.free();
		this._pickingViewProjBuffer?.destroy();
	}
}
