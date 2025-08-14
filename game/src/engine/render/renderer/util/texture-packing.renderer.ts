import { Texture } from ':engine/data/texture/texture';
import { Vec2 } from ':engine/data/vec/vec2';
import type { RenderPipeline } from ':engine/render/pipeline/render-pipeline';
import { TexturePackingVec3F32Pipeline } from ':engine/render/pipeline/util/packing/texture-packing-vec3-f32.pipeline';
import { TexturePackingVec4Pipeline } from ':engine/render/pipeline/util/packing/texture-packing-vec4.pipeline';
import { TexturePackerVec3f32Shader } from '../../../../shaders/util/texture-packer/texture-packer-vec3-f32-shader';
import { TexturePackerVec4Shader } from '../../../../shaders/util/texture-packer/texture-packer-vec4-shader';

export class TexturePackingRenderer {
	private readonly _pipelineVec4 = new TexturePackingVec4Pipeline();
	private readonly _pipelineVec3f32 = new TexturePackingVec3F32Pipeline();

	private readonly _sampler = device.createSampler({
		label: 'texture packing sampler',
		magFilter: 'linear',
		minFilter: 'linear',
	});

	async initialize() {
		await this._pipelineVec4.initialize();
		await this._pipelineVec3f32.initialize();
	}

	private getMaximumTextureDimensions(textures: Texture[]) {
		let width = 1;
		let height = 1;
		textures.forEach(tex => {
			width = Math.max(width, tex.texture.width);
			height = Math.max(height, tex.texture.height);
		});
		return new Vec2(width, height);
	}

	private createTargetTexture(sources: Texture[], format: GPUTextureFormat) {
		const resolution = this.getMaximumTextureDimensions(sources);
		const targetGPUTex = device.createTexture({
			size: [resolution.x, resolution.y],
			format,
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
		});
		return new Texture(targetGPUTex);
	}

	async pack_4r_rgba8unorm(r: Texture, g: Texture, b: Texture, a: Texture) {
		const targetTex = this.createTargetTexture([r, g, b, a], 'rgba8unorm');
		const sourceBindings = device.createBindGroup({
			layout: this._pipelineVec4.gpuPipeline.getBindGroupLayout(TexturePackerVec4Shader.BINDING_GROUPS.TEXTURE),
			entries: [
				{ binding: 0, resource: this._sampler },
				{ binding: 1, resource: r.view },
				{ binding: 2, resource: g.view },
				{ binding: 3, resource: b.view },
				{ binding: 4, resource: a.view },
			],
		});
		await this.packTexture(sourceBindings, this._pipelineVec4, targetTex);
		return targetTex;
	}

	async pack_1rgb1a_rgba8unorm(rgb: Texture, a: Texture) {
		const targetTex = this.createTargetTexture([rgb, a], 'rgba8unorm');
		const sourceBindings = device.createBindGroup({
			layout: this._pipelineVec3f32.gpuPipeline.getBindGroupLayout(
				TexturePackerVec3f32Shader.BINDING_GROUPS.TEXTURE,
			),
			entries: [
				{ binding: 0, resource: this._sampler },
				{ binding: 1, resource: rgb.view },
				{ binding: 2, resource: a.view },
			],
		});
		await this.packTexture(sourceBindings, this._pipelineVec3f32, targetTex);
		return targetTex;
	}

	private async packTexture(sourceBindGroup: GPUBindGroup, pipeline: RenderPipeline, target: Texture) {
		const commandEncoder = device.createCommandEncoder();
		pipeline.defineColorRenderAttachment(0, target.view);
		const rpe = pipeline.beginRenderPassAndSetPipeline(commandEncoder);
		rpe.setBindGroup(0, sourceBindGroup);
		rpe.draw(6);
		rpe.end();
		device.queue.submit([commandEncoder.finish()]);
		await device.queue.onSubmittedWorkDone();
	}

	free() {
		// Nothing to free here
	}
}
