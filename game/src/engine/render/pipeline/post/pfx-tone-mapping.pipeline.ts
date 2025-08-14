import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { PFXTonemapShader } from '../../../../shaders/post/pfx-tone-mapping/pfx-tone-mapping-shader';
import { BufferUtils } from '../../../../utils/buffer-utils';
import { RenderPipeline } from '../render-pipeline';

export class PfxToneMappingPipeline extends RenderPipeline {
	gpuShader = new PFXTonemapShader('PFX and tone mapping');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	private _optionsBuffer!: GPUBuffer;
	private _optionsBindGroup!: GPUBindGroup;

	private _textureBindGroup!: GPUBindGroup;

	private readonly _sampler = device.createSampler({
		addressModeU: 'clamp-to-edge',
		addressModeV: 'clamp-to-edge',
	});

	async initialize(pool: RenderResourcePool) {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline(navigator.gpu.getPreferredCanvasFormat());
		this._optionsBuffer = this.buildOptionsBuffer();
		this._optionsBindGroup = this.buildOptionsBindGroup();
		this.updateTextureBindGroup(pool);
	}

	private buildPipeline(textureFormat: GPUTextureFormat) {
		return device.createRenderPipelineAsync({
			label: 'rs pfx and tonemapping pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
				buffers: [] as GPUVertexBufferLayout[],
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [{ format: textureFormat }],
				constants: {
					bloom_strength: game.engine.config.graphics.useBloom ? 0.04 : 0,
					motion_blur_amount: Math.max(0, game.engine.config.graphics.motionBlurAmount),
					use_film_grain: game.engine.config.graphics.useFilmGrain ? 1 : 0,
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
					// view: Assigned later
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
					loadOp: 'clear',
					storeOp: 'store',
				} as GPURenderPassColorAttachment,
			],
		} as GPURenderPassDescriptor;
	}

	private buildOptionsBuffer() {
		return BufferUtils.createEmptyBuffer(7 * 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
	}

	private buildOptionsBindGroup() {
		return device.createBindGroup({
			label: 'PFX Options',
			layout: this.gpuPipeline.getBindGroupLayout(PFXTonemapShader.BINDING_GROUPS.OPTIONS),
			entries: [{ binding: 0, resource: { buffer: this._optionsBuffer } }],
		});
	}

	updateTextureBindGroup(pool: RenderResourcePool) {
		this._textureBindGroup = device.createBindGroup({
			label: 'PFX textures',
			layout: this.gpuPipeline.getBindGroupLayout(PFXTonemapShader.BINDING_GROUPS.TEXTURES),
			entries: [
				{ binding: 0, resource: this._sampler },
				{ binding: 1, resource: pool.hdrBufferChain.current.view },
				{ binding: 2, resource: pool.bloomMips.texture.createView() },
				{ binding: 3, resource: pool.velocityTextureView },
				{ binding: 4, resource: pool.outlineTextureView },
			],
		});
	}

	bindBindGroup(rpe: GPURenderPassEncoder) {
		rpe.setBindGroup(PFXTonemapShader.BINDING_GROUPS.TEXTURES, this._textureBindGroup);
		rpe.setBindGroup(PFXTonemapShader.BINDING_GROUPS.OPTIONS, this._optionsBindGroup);
	}

	defineRenderAttachments(pool: RenderResourcePool) {
		this.defineColorRenderAttachment(0, pool.canvasTextureView);
	}

	render(pool: RenderResourcePool, rpe: GPURenderPassEncoder): void {
		pool.renderPostEffects.writeToBuffer(this._optionsBuffer);
		rpe.draw(6);
	}

	free() {
		this._optionsBuffer.destroy();
	}
}
