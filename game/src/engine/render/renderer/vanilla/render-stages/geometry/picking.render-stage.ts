import { Mat4 } from ':engine/data/mat/mat4';
import type { Vec2 } from ':engine/data/vec/vec2';
import { PickingPipeline } from ':engine/render/pipeline/geometry/picking.pipeline';
import type { Resolution } from ':engine/resolution';
import { MathUtils } from '../../../../../../utils/math-utils';
import type { RenderResourcePool } from '../../render-resource-pool';
import type { RenderStage } from '../render-stage';

export class RenderStagePicking implements RenderStage {
	private readonly _pipeline = new PickingPipeline();

	async initialize() {
		await this._pipeline.initialize();
	}

	private createProjectionMatrix(resolution: Resolution, mouse: Vec2, fovY: number, near: number, far: number) {
		const screenWidth = resolution.full.x;
		const screenHeight = resolution.full.y;
		const aspect = resolution.aspectRatio;
		const top = Math.tan(MathUtils.degToRad(fovY) * 0.5) * near;
		const bottom = -top;
		const left = aspect * bottom;
		const right = aspect * top;
		const width = Math.abs(right - left);
		const height = Math.abs(top - bottom);

		const pixelX = mouse.x;
		const pixelY = screenHeight - mouse.y - 1;

		const subLeft = left + (pixelX * width) / screenWidth;
		const subBottom = bottom + (pixelY * height) / screenHeight;
		const subWidth = width / screenWidth;
		const subHeight = height / screenHeight;

		return Mat4.frustum(subLeft, subLeft + subWidth, subBottom, subBottom + subHeight, near, far);
	}

	render(pool: RenderResourcePool) {
		const camera = pool.scene.activeCamera;
		if (!camera) return;

		pool.commandEncoder.pushDebugGroup('Picking Renderer');
		const projectionMatrix = this.createProjectionMatrix(
			pool.resolution,
			game.engine.managers.io.mouse.position,
			pool.renderProjection.fovY,
			pool.renderProjection.near,
			pool.renderProjection.far,
		);
		this._pipeline.writeMatricesToBuffer(camera.viewMatrix, projectionMatrix);

		this._pipeline.defineRenderAttachments();
		const rpe = pool.commandEncoder.beginRenderPass(this._pipeline.gpuRenderPassDescriptor);

		rpe.setPipeline(this._pipeline.gpuPipeline);
		this._pipeline.bindBindGroups(rpe);
		this._pipeline.render(rpe, pool.scene.entitiesToRender);
		rpe.end();

		this._pipeline.copyPickingTextureToBuffer(pool.pickingBuffer, pool.commandEncoder);
		pool.commandEncoder.popDebugGroup();
	}
}
