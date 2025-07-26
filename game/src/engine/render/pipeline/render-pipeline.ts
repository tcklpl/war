import type { PrimitiveDrawOptions } from ':engine/data/meshes/primitive-draw-options';
import type { WindingOrder } from ':engine/data/meshes/winding-order';
import type { SceneInfoBindGroupOptions } from ':engine/data/scene/scene-info-bind-group-options';
import type { Renderable } from ':engine/traits/renderable.trait';
import type { Shader } from '../../../shaders/shader';
import type { RenderResourcePool } from '../renderer/vanilla/render-resource-pool';

abstract class RenderPipelineBase {
	abstract readonly gpuShader: Shader;
	gpuPipeline!: GPURenderPipeline;
	abstract readonly gpuRenderPassDescriptor: GPURenderPassDescriptor;
	abstract defineRenderAttachments(pool: RenderResourcePool): void;
	abstract bindBindGroups(rpe: GPURenderPassEncoder, pool: RenderResourcePool): void;

	defineColorRenderAttachment(index: number, view: GPUTextureView) {
		const colorAttachments = this.gpuRenderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[];
		if (index >= colorAttachments.length) {
			console.warn(
				`Trying to define color render attachment index ${index} on a render pass descriptor that only has ${colorAttachments.length}`,
			);
			return;
		}
		colorAttachments[index].view = view;
	}

	defineDepthRenderAttachment(view: GPUTextureView) {
		if (!this.gpuRenderPassDescriptor.depthStencilAttachment) {
			console.warn(
				`Trying to define depth render attachment on a render pass descriptor that doesn't have a depth stencil attachment`,
			);
			return;
		}
		this.gpuRenderPassDescriptor.depthStencilAttachment.view = view;
	}

	free?(): void;
}

export abstract class RenderPipeline extends RenderPipelineBase {
	abstract initialize(resources: RenderResourcePool): Promise<void>;

	abstract render(rpe: GPURenderPassDescriptor): void;
}

export abstract class GeometryRenderPipeline extends RenderPipelineBase {
	abstract primitiveDrawOptions: PrimitiveDrawOptions;
	abstract sceneInfoBindGroupOptions: SceneInfoBindGroupOptions;
	abstract initialize(pool: RenderResourcePool, windingOrder: WindingOrder): Promise<void>;

	render(rpe: GPURenderPassEncoder, objects: Renderable[]) {
		objects.forEach(o => o.render(rpe, this.gpuPipeline, this.primitiveDrawOptions));
	}
}
