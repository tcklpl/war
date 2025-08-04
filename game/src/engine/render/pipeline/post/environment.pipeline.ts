import type { Camera } from ':engine/data/camera/camera';
import { SceneInfoBindGroupOptions } from ':engine/data/scene/scene-info-bind-group-options';
import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { EnvironmentShader } from '../../../../shaders/post/environment/environment-shader';
import { BufferUtils } from '../../../../utils/buffer-utils';
import { Mat4 } from '../../../data/mat/mat4';
import { RenderPipeline } from '../render-pipeline';

export class EnvironmentPipeline extends RenderPipeline {
	gpuShader = new EnvironmentShader('Environment');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	private readonly _sceneBindGroupOptions = new SceneInfoBindGroupOptions(EnvironmentShader.BINDING_GROUPS.SCENE)
		.includePrefilteredSkybox(0)
		.includeBrdfLUT(1);

	private _environmentVariablesBuffer!: GPUBuffer;
	private _environmentVariablesBindGroup!: GPUBindGroup;

	private _environmentTextureBindGroup!: GPUBindGroup;

	private readonly _sampler = device.createSampler({
		minFilter: 'linear',
		magFilter: 'linear',
		mipmapFilter: 'linear',
	});

	async initialize(pool: RenderResourcePool) {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline(pool.hdrTextureFormat);
		this._environmentVariablesBuffer = this.buildVariablesBuffer();
		this._environmentVariablesBindGroup = this.buildVariablesBindBuffer();
		this.updateEnvironmentTextureBindGroup(pool);
	}

	private buildPipeline(hdrTextureFormat: GPUTextureFormat) {
		return device.createRenderPipelineAsync({
			label: 'environment pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
				buffers: [],
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [
					{
						format: hdrTextureFormat,
						blend: {
							color: {
								operation: 'add',
								srcFactor: 'one',
								dstFactor: 'one',
							},
							alpha: {
								operation: 'max',
								srcFactor: 'one',
								dstFactor: 'one',
							},
						},
					} as GPUColorTargetState,
				],
				constants: {
					use_ssao: game.engine.config.graphics.useSSAO ? 1 : 0,
				},
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

	private buildVariablesBuffer() {
		return BufferUtils.createEmptyBuffer(3 * Mat4.byteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
	}

	private buildVariablesBindBuffer() {
		return device.createBindGroup({
			label: 'environment variable bind group',
			layout: this.gpuPipeline.getBindGroupLayout(EnvironmentShader.BINDING_GROUPS.VARIABLES),
			entries: [{ binding: 0, resource: { buffer: this._environmentVariablesBuffer } }],
		});
	}

	updateEnvironmentTextureBindGroup(pool: RenderResourcePool) {
		this._environmentTextureBindGroup = device.createBindGroup({
			label: 'environment texture bind group',
			layout: this.gpuPipeline.getBindGroupLayout(EnvironmentShader.BINDING_GROUPS.TEXTURES),
			entries: [
				{ binding: 0, resource: this._sampler },
				{ binding: 1, resource: pool.depthTextureView },
				{ binding: 2, resource: pool.normalTextureView },
				{ binding: 3, resource: pool.specularTextureView },
				{ binding: 4, resource: pool.ssaoTextureViewBlurred },
			],
		});
	}

	updateEnvironmentVariablesBuffer(pool: RenderResourcePool) {
		device.queue.writeBuffer(this._environmentVariablesBuffer, 0, pool.projectionMatrix.toF32Array());
		device.queue.writeBuffer(
			this._environmentVariablesBuffer,
			Mat4.byteSize,
			pool.inverseProjectionMatrix.toF32Array(),
		);
		device.queue.writeBuffer(
			this._environmentVariablesBuffer,
			2 * Mat4.byteSize,
			(pool.scene.activeCamera as Camera).cameraMatrix.toF32Array(),
		);
	}

	bindBindGroups(rpe: GPURenderPassEncoder, pool: RenderResourcePool) {
		rpe.setBindGroup(
			EnvironmentShader.BINDING_GROUPS.SCENE,
			pool.scene.info.getBindGroup(this.gpuPipeline, this._sceneBindGroupOptions),
		);
		rpe.setBindGroup(EnvironmentShader.BINDING_GROUPS.TEXTURES, this._environmentTextureBindGroup);
		rpe.setBindGroup(EnvironmentShader.BINDING_GROUPS.VARIABLES, this._environmentVariablesBindGroup);
	}

	defineRenderAttachments(pool: RenderResourcePool): void {
		this.defineColorRenderAttachment(0, pool.hdrBufferChain.current.view);
	}

	render(_pool: RenderResourcePool, rpe: GPURenderPassEncoder): void {
		rpe.draw(6);
	}

	free() {
		this._environmentVariablesBuffer.destroy();
	}
}
