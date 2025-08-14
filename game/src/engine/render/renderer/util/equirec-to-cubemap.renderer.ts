import { Mat4 } from ':engine/data/mat/mat4';
import { Vec3 } from ':engine/data/vec/vec3';
import { EquirecToCubemapPipeline } from ':engine/render/pipeline/util/equirec-to-cubemap.pipeline';
import { BadResolutionError } from '../../../../errors/engine/data/bad-resolution';
import { EquirectangularShader } from '../../../../shaders/util/equirectangular/equirectangular-shader';
import { BufferUtils } from '../../../../utils/buffer-utils';
import { MathUtils } from '../../../../utils/math-utils';

export class EquirectangularToCubemapRenderer {
	private readonly _pipeline16f = new EquirecToCubemapPipeline('rgba16float');
	private readonly _pipeline32f = new EquirecToCubemapPipeline('rgba32float');

	private readonly _projectionMat = Mat4.perspective(MathUtils.degToRad(90), 1, 0.1, 10);
	private readonly _cameraMatrices = [
		Mat4.lookAt(Vec3.zero, new Vec3(1, 0, 0), new Vec3(0, 1, 0)), // + X
		Mat4.lookAt(Vec3.zero, new Vec3(-1, 0, 0), new Vec3(0, 1, 0)), // - X
		Mat4.lookAt(Vec3.zero, new Vec3(0, 1, 0), new Vec3(0, 0, 1)), // + Y
		Mat4.lookAt(Vec3.zero, new Vec3(0, -1, 0), new Vec3(0, 0, -1)), // - Y
		Mat4.lookAt(Vec3.zero, new Vec3(0, 0, -1), new Vec3(0, 1, 0)), // - Z
		Mat4.lookAt(Vec3.zero, new Vec3(0, 0, 1), new Vec3(0, 1, 0)), // + Z
	];
	private readonly _uniformBuffer = BufferUtils.createEmptyBuffer(
		2 * Mat4.byteSize,
		GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	);

	private _matrixBindGroup16f!: GPUBindGroup;
	private _matrixBindGroup32f!: GPUBindGroup;

	private readonly _sampler = device.createSampler({
		label: 'equirec to cubemap sampler',
	});

	async initialize() {
		await this._pipeline16f.initialize();
		await this._pipeline32f.initialize();

		// write projection matrix to buffer as it won't change
		device.queue.writeBuffer(this._uniformBuffer, Mat4.byteSize, this._projectionMat.toF32Array());

		this._matrixBindGroup16f = this.createMatrixBindGroup(this._pipeline16f.gpuPipeline);
		this._matrixBindGroup32f = this.createMatrixBindGroup(this._pipeline32f.gpuPipeline);
	}

	private createMatrixBindGroup(pipeline: GPURenderPipeline) {
		return device.createBindGroup({
			label: 'equirec to cubemap matrix bindgroup',
			layout: pipeline.getBindGroupLayout(EquirectangularShader.BINDING_GROUPS.VIEWPROJ),
			entries: [{ binding: 0, resource: { buffer: this._uniformBuffer } }],
		});
	}

	async renderEquirectangularMapToCubemap(
		equirecImage: GPUTexture,
		options: {
			cubemapResolution: number;
			mipCount: number;
		},
	) {
		if (options.cubemapResolution <= 0 || options.cubemapResolution > device.limits.maxTextureDimension3D) {
			throw new BadResolutionError(
				`Trying to render an equirectangular texture to a cubemap of resolution ${options.cubemapResolution}, should be between [1, ${device.limits.maxTextureDimension3D}]`,
			);
		}

		// create destination 3d texture
		const finalCubemap = device.createTexture({
			label: 'final cubemap texture',
			format: 'rgba16float',
			dimension: '2d',
			size: [options.cubemapResolution, options.cubemapResolution, 6],
			mipLevelCount: options.mipCount,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
		});

		/*
            Select which pipeline and bind group are going to be used.
            We cannot use the same one as 'rgba32float' is an 'unfilterable-float' texture and its layout has to be
            explicitly defined, whereas we can just use 'auto' for filterable textures.
        */
		const pipeline = equirecImage.format === 'rgba32float' ? this._pipeline32f : this._pipeline16f;
		const matrixBindGroup =
			equirecImage.format === 'rgba32float' ? this._matrixBindGroup32f : this._matrixBindGroup16f;

		// create bindgroup to hold the supplied texture
		const texBindGroup = device.createBindGroup({
			label: 'equirec to cubemap conversion texture bindgroup',
			layout: pipeline.gpuPipeline.getBindGroupLayout(EquirectangularShader.BINDING_GROUPS.TEXTURE),
			entries: [
				{ binding: 0, resource: this._sampler },
				{ binding: 1, resource: equirecImage.createView() },
			],
		});

		// render for all 6 sides
		for (let i = 0; i < 6; i++) {
			const cameraMatrix = this._cameraMatrices[i];

			// write view matrix to buffer
			device.queue.writeBuffer(this._uniformBuffer, 0, cameraMatrix.toF32Array());

			const cubemapFaceView = finalCubemap.createView({
				arrayLayerCount: 1,
				baseArrayLayer: i,
				baseMipLevel: 0,
				mipLevelCount: 1,
			});

			const commandEncoder = device.createCommandEncoder();
			pipeline.defineColorRenderAttachment(0, cubemapFaceView);

			const passEncoder = pipeline.beginRenderPassAndSetPipeline(commandEncoder);

			// bind uniforms
			passEncoder.setBindGroup(EquirectangularShader.BINDING_GROUPS.VIEWPROJ, matrixBindGroup);
			passEncoder.setBindGroup(EquirectangularShader.BINDING_GROUPS.TEXTURE, texBindGroup);

			// draw to texture
			// will draw 36 vertices, no data needs to be supplied as the vertices are hard coded into the shader
			passEncoder.draw(36);
			passEncoder.end();

			device.queue.submit([commandEncoder.finish()]);
		}

		// wait for all the rendering to be done and return the texture
		await device.queue.onSubmittedWorkDone();
		return finalCubemap;
	}

	free() {
		this._uniformBuffer?.destroy();
	}
}
