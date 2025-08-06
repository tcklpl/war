import { Texture } from ':engine/data/texture/texture';
import { SSAOPipeline } from ':engine/render/pipeline/post/ssao.pipeline';
import { SSAOBlurPipeline } from ':engine/render/pipeline/post/ssao-blur.pipeline';
import { Float16Array } from '@petamoriken/float16';
import { SSAOBlurShader } from '../../../../../../shaders/post/ssao/ssao-blur-shader';
import { SSAOShader } from '../../../../../../shaders/post/ssao/ssao-shader';
import { BufferUtils } from '../../../../../../utils/buffer-utils';
import { MathUtils } from '../../../../../../utils/math-utils';
import { Mat4 } from '../../../../../data/mat/mat4';
import { Vec2 } from '../../../../../data/vec/vec2';
import { Vec3 } from '../../../../../data/vec/vec3';
import type { RenderResourcePool } from '../../render-resource-pool';
import type { RenderStage } from '../render-stage';

export class RenderStageSSAO implements RenderStage {
	private readonly _bias = 0.0025;
	private readonly _kernelSize = 64;
	private readonly _kernelRadius = 1.0;
	private _kernel: Vec3[] = [];
	private readonly _kernelBuffer = BufferUtils.createEmptyBuffer(
		4 + 4 + (Vec3.byteSize + 4) * this._kernelSize,
		GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
	);

	private _noise: Vec2[] = [];
	private readonly _noiseTexture = new Texture();
	private readonly _samplerRepeat = device.createSampler({
		addressModeU: 'repeat',
		addressModeV: 'repeat',
		minFilter: 'nearest',
		magFilter: 'nearest',
	});
	private readonly _samplerClamp = device.createSampler({
		addressModeU: 'clamp-to-edge',
		addressModeV: 'clamp-to-edge',
		minFilter: 'linear',
		magFilter: 'linear',
	});

	private readonly _ssaoPipeline = new SSAOPipeline();
	private readonly _ssaoOptionsBuffer = BufferUtils.createEmptyBuffer(
		2 * Mat4.byteSize + 4,
		GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
	);
	private _ssaoOptKernelBindGroup!: GPUBindGroup;

	private readonly _ssaoBlurPipeline = new SSAOBlurPipeline();

	async initialize(pool: RenderResourcePool) {
		this.buildKernel();
		this.writeKernelBuffer();
		await this.buildNoiseMap();

		await this._ssaoPipeline.initialize(pool);
		await this._ssaoBlurPipeline.initialize(pool);
		this._ssaoOptKernelBindGroup = this.createSSAOOptKernelBindGroup();
	}

	private buildKernel() {
		this._kernel = [];

		for (let i = 0; i < this._kernelSize; i++) {
			// X and Y between -1.0 and 1.0 and Z between 0.0 and 1.0 to create a hemisphere
			// Math.random() already returns a float between 0.0 and 1.0
			const sample = new Vec3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random()).normalize();

			sample.multiplyFactor(Math.random());

			// Get more samples closer to the origin
			let scale = i / this._kernelSize;
			scale = MathUtils.lerp(0.1, 1.0, scale * scale);
			sample.multiplyFactor(scale);

			this._kernel.push(sample);
		}
	}

	private writeKernelBuffer() {
		/*
            Kernel buffer will look like this:

                0   4   8   B   F
            000 ▒▒▒▒░░░░--------   [u32 "kernel size" (4 bytes)] + [f32 "kernel radius" (4 bytes)] + [padding (8 bytes)]
            010 ░  sample  ░----   [vec3f "sample 0" (12 bytes)] + [padding (4 bytes)]
            020 ░  sample  ░----   [vec3f "sample 1" (12 bytes)] + [padding (4 bytes)]
            030 ░  sample  ░----   [vec3f "sample 2" (12 bytes)] + [padding (4 bytes)]
            ...
            400 ░  sample  ░----   [vec3f "sample 63" (12 bytes)] + [padding (4 bytes)]

            -: padding
            ░: f32
            ▒: u32
        */
		device.queue.writeBuffer(this._kernelBuffer, 0, new Uint32Array([this._kernelSize]));
		device.queue.writeBuffer(this._kernelBuffer, 4, new Float32Array([this._kernelRadius]));
		const paddedKernel = this._kernel.flatMap(s => [s.x, s.y, s.z, 0]); // extra 0 for padding
		device.queue.writeBuffer(this._kernelBuffer, 0x10, new Float32Array(paddedKernel));
	}

	private writeOptionsBuffer(pool: RenderResourcePool) {
		/*
            Options buffer will look like this:

                0   4   8   B   F
            000 ░░  proj mat  ░░   [mat4x4f "projection matrix" (64 bytes)]
            040 ░ inv proj mat ░   [mat4x4f "inverse projection matrix" (64 bytes)]
            080 ░░░░░░░░--------   [f32 "bias" (4 bytes)] + [f32 "tan half fov" (4 bytes)] + [padding (8 bytes)]

            -: padding
            ░: f32
        */

		device.queue.writeBuffer(this._ssaoOptionsBuffer, 0x00, pool.projectionMatrix.toF32Array());
		device.queue.writeBuffer(this._ssaoOptionsBuffer, 1 * Mat4.byteSize, pool.inverseProjectionMatrix.toF32Array());
		device.queue.writeBuffer(this._ssaoOptionsBuffer, 2 * Mat4.byteSize, new Float32Array([this._bias]));
	}

	private async buildNoiseMap() {
		this._noise = [];
		this._noiseTexture.free();

		// 16 as the noise will be a 4x4 texture
		for (let i = 0; i < 16; i++) {
			const noise = new Vec2(Math.random() * 2 - 1, Math.random() * 2 - 1);
			this._noise.push(noise);
		}

		// build noise texture
		this._noiseTexture.texture = device.createTexture({
			size: [4, 4],
			format: 'rg16float',
			usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
		});

		const noiseF16 = new Float16Array(this._noise.flatMap(v => [v.x, v.y]));

		device.queue.writeTexture(
			{ texture: this._noiseTexture.texture },
			noiseF16.buffer,
			{ bytesPerRow: 16, rowsPerImage: 4 },
			{ width: 4, height: 4 },
		);

		await device.queue.onSubmittedWorkDone();
	}

	private createSSAOOptKernelBindGroup() {
		return device.createBindGroup({
			label: 'ssao opt and kernel bind group',
			layout: this._ssaoPipeline.gpuPipeline.getBindGroupLayout(SSAOShader.BINDING_GROUPS.OPT_KERNEL),
			entries: [
				{ binding: 0, resource: { buffer: this._ssaoOptionsBuffer } },
				{ binding: 1, resource: { buffer: this._kernelBuffer } },
			],
		});
	}

	private createSSAOTexturesBindGroup(pool: RenderResourcePool) {
		return device.createBindGroup({
			label: 'ssao textures bind group',
			layout: this._ssaoPipeline.gpuPipeline.getBindGroupLayout(SSAOShader.BINDING_GROUPS.TEXTURES),
			entries: [
				{ binding: 0, resource: this._samplerRepeat },
				{ binding: 1, resource: this._samplerClamp },
				{ binding: 2, resource: this._noiseTexture.view },
				{ binding: 3, resource: pool.depthTextureView },
				{ binding: 4, resource: pool.normalTextureView },
			],
		});
	}

	private createSSAOBlurBindGroup(pool: RenderResourcePool) {
		return device.createBindGroup({
			label: 'ssao blur textures bind group',
			layout: this._ssaoBlurPipeline.gpuPipeline.getBindGroupLayout(SSAOBlurShader.BINDING_GROUPS.TEXTURES),
			entries: [
				{ binding: 0, resource: this._samplerClamp },
				{ binding: 1, resource: pool.ssaoTextureNoisy.view },
			],
		});
	}

	private renderSSAO(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('SSAO Renderer - SSAO');

		this.writeOptionsBuffer(pool);
		const texturesBindGroup = this.createSSAOTexturesBindGroup(pool);

		this._ssaoPipeline.defineColorRenderAttachment(0, pool.ssaoTextureViewNoisy);

		const rpe = this._ssaoPipeline.beginRenderPassAndSetPipeline(pool.commandEncoder);
		rpe.setBindGroup(SSAOShader.BINDING_GROUPS.OPT_KERNEL, this._ssaoOptKernelBindGroup);
		rpe.setBindGroup(SSAOShader.BINDING_GROUPS.TEXTURES, texturesBindGroup);
		rpe.draw(6);
		rpe.end();

		pool.commandEncoder.popDebugGroup();
	}

	private blurSSAO(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('SSAO Renderer - Blur');

		const texturesBindGroup = this.createSSAOBlurBindGroup(pool);
		this._ssaoBlurPipeline.defineColorRenderAttachment(0, pool.ssaoTextureBlurred.view);

		const rpe = this._ssaoBlurPipeline.beginRenderPassAndSetPipeline(pool.commandEncoder);
		rpe.setBindGroup(SSAOBlurShader.BINDING_GROUPS.TEXTURES, texturesBindGroup);
		rpe.draw(6);
		rpe.end();

		pool.commandEncoder.popDebugGroup();
	}

	render(pool: RenderResourcePool) {
		pool.commandEncoder.pushDebugGroup('SSAO Renderer');
		this.renderSSAO(pool);
		this.blurSSAO(pool);
		pool.commandEncoder.popDebugGroup();
	}

	free() {
		this._noiseTexture.free();
	}
}
