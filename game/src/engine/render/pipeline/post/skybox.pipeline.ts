import type { RenderResourcePool } from ':engine/render/renderer/vanilla/render-resource-pool';
import { SkyboxShader } from '../../../../shaders/geometry/skybox/skybox-shader';
import { RenderPipeline } from '../render-pipeline';

export class SkyboxPipeline extends RenderPipeline {
	gpuShader = new SkyboxShader('skybox shader');
	gpuRenderPassDescriptor = this.buildRenderPassDescriptor();

	private _viewProjBindGroup!: GPUBindGroup;

	async initialize(pool: RenderResourcePool) {
		await this.gpuShader.compile();
		this.gpuPipeline = await this.buildPipeline(pool.hdrTextureFormat);
		this._viewProjBindGroup = this.buildViewProjBindGroup(pool.viewProjBuffer);
	}

	private buildPipeline(hdrTextureFormat: GPUTextureFormat) {
		return device.createRenderPipelineAsync({
			label: 'rs skybox pipeline',
			layout: 'auto',
			vertex: {
				module: this.gpuShader.module,
				entryPoint: 'vertex',
				buffers: [] as GPUVertexBufferLayout[],
			},
			fragment: {
				module: this.gpuShader.module,
				entryPoint: 'fragment',
				targets: [{ format: hdrTextureFormat }],
			},
			primitive: {
				topology: 'triangle-list',
				cullMode: 'front',
			},
			depthStencil: {
				depthWriteEnabled: false,
				depthCompare: 'less-equal',
				format: 'depth24plus',
			},
		});
	}

	private buildRenderPassDescriptor() {
		return {
			colorAttachments: [
				{
					// view: undefined, Assigned later
					// resolveTarget: undefined, Assigned Later
					clearValue: { r: 0, g: 0, b: 0, a: 1 },
					loadOp: 'load',
					storeOp: 'store',
				},
			] as GPURenderPassColorAttachment[],
			depthStencilAttachment: {
				// view: undefined, Assigned later
				depthReadOnly: true,
			} as GPURenderPassDepthStencilAttachment,
		} as GPURenderPassDescriptor;
	}

	private buildViewProjBindGroup(buffer: GPUBuffer) {
		return device.createBindGroup({
			label: 'PBR ViewProj',
			layout: this.gpuPipeline.getBindGroupLayout(SkyboxShader.BINDING_GROUPS.VIEW_PROJ),
			entries: [{ binding: 0, resource: { buffer: buffer } }],
		});
	}

	render(_pool: RenderResourcePool, rpe: GPURenderPassEncoder): void {
		rpe.draw(36);
	}

	defineRenderAttachments(pool: RenderResourcePool): void {
		this.defineDepthRenderAttachment(pool.depthTextureView);
		this.defineColorRenderAttachment(0, pool.hdrBufferChain.current.view);
	}

	bindBindGroups(rpe: GPURenderPassEncoder, skyboxBindGroup: GPUBindGroup) {
		rpe.setBindGroup(SkyboxShader.BINDING_GROUPS.VIEW_PROJ, this._viewProjBindGroup);
		rpe.setBindGroup(SkyboxShader.BINDING_GROUPS.TEXTURE, skyboxBindGroup);
	}
}
