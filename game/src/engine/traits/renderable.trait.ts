import type { Mesh } from ':engine/data/meshes/mesh';
import type { PrimitiveDrawOptions } from ':engine/data/meshes/primitive-draw-options';
import type { GeometryRenderPipeline } from ':engine/render/pipeline/render-pipeline';
import type { Constructor } from 'typeUtils';

export interface Renderable {
	mesh?: Mesh;
	readonly pipeline: Constructor<GeometryRenderPipeline>;

	registerRenderableObjectBuffer(buffer: GPUBuffer): void;
	render(rpe: GPURenderPassEncoder, pipeline: GPURenderPipeline, options: PrimitiveDrawOptions): void;
}

export interface RenderableOptions {
	pipeline: Constructor<GeometryRenderPipeline>;
	modelBindGroupIndex: number;
}

export function renderable<T extends Constructor>(
	renderableOptions: RenderableOptions,
	base: T,
): Constructor<Renderable> & T {
	return class extends base {
		mesh?: Mesh;
		readonly pipeline = renderableOptions.pipeline;

		private _renderableObjectBuffer?: GPUBuffer;

		private readonly _bindGroupsPerPipeline = new Map<GPURenderPipeline, GPUBindGroup>();

		registerRenderableObjectBuffer(buffer: GPUBuffer) {
			this._renderableObjectBuffer = buffer;
		}

		private getBindGroupForPipeline(pipeline: GPURenderPipeline) {
			const existing = this._bindGroupsPerPipeline.get(pipeline);
			if (existing) return existing;

			const bindGroup = device.createBindGroup({
				label: 'Entity model matrix',
				layout: pipeline.getBindGroupLayout(renderableOptions.modelBindGroupIndex),
				entries: [{ binding: 0, resource: { buffer: this._renderableObjectBuffer as GPUBuffer } }],
			});
			this._bindGroupsPerPipeline.set(pipeline, bindGroup);
			return bindGroup;
		}

		render(rpe: GPURenderPassEncoder, pipeline: GPURenderPipeline, options: PrimitiveDrawOptions) {
			if (!this.mesh) {
				console.warn('Trying to render an object without a mesh');
				return;
			}
			if (!this._renderableObjectBuffer) {
				console.warn('Trying to render without an object buffer');
				return;
			}
			rpe.setBindGroup(renderableOptions.modelBindGroupIndex, this.getBindGroupForPipeline(pipeline));
			this.mesh.draw(rpe, pipeline, options);
		}
	};
}
