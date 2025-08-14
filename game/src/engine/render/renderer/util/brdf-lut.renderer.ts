import { BRDFLUTPipeline } from ':engine/render/pipeline/util/brdf-lut.pipeline';

export class BRDFLUTRenderer {
	private readonly _pipeline = new BRDFLUTPipeline();

	async initialize() {
		await this._pipeline.initialize();
	}

	async renderLUT(resolution = 512) {
		// create destination texture
		const renderTarget = device.createTexture({
			label: 'LUT texture',
			format: 'rg16float',
			dimension: '2d',
			size: [resolution, resolution],
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
		});

		this._pipeline.defineColorRenderAttachment(0, renderTarget.createView());

		const commandEncoder = device.createCommandEncoder();
		const passEncoder = this._pipeline.beginRenderPassAndSetPipeline(commandEncoder);
		// draw to texture
		// will draw 6 vertices, no data needs to be supplied as the vertices are hard coded into the shader
		passEncoder.draw(6);
		passEncoder.end();

		device.queue.submit([commandEncoder.finish()]);

		// wait for all the rendering to be done and return the texture
		await device.queue.onSubmittedWorkDone();
		return renderTarget;
	}

	free() {
		// Nothing to free here
	}
}
