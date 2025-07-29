import type { Camera } from ':engine/data/camera/camera';
import { DirectionalLight } from ':engine/data/lights/directional-light';
import { Mat4 } from ':engine/data/mat/mat4';
import { Vec3 } from ':engine/data/vec/vec3';
import { Vec4 } from ':engine/data/vec/vec4';
import { DepthPipeline } from ':engine/render/pipeline/geometry/depth.pipeline';
import { MathUtils } from '../../../../../utils/math-utils';
import { MatrixUtils } from '../../../../../utils/matrix-utils';
import type { RenderProjection } from '../render-projection';
import type { RenderResourcePool } from '../render-resource-pool';
import type { RenderStage } from './render-stage';

export class RenderStageLights implements RenderStage {
	private readonly _zMult = 1;
	private readonly _depthPipeline = new DepthPipeline();

	async initialize() {
		await this._depthPipeline.initialize();
	}

	private getDirectionalLightViewProjMatrix(
		light: DirectionalLight,
		camera: Camera,
		renderProjection: RenderProjection,
	) {
		// light projection matrix, used to get frustum corners
		const proj = Mat4.perspective(
			Math.PI - 0.5 * MathUtils.degToRad(renderProjection.fovY),
			renderProjection.resolution.aspectRatio,
			0.9, // renderProjection.near,
			30, //renderProjection.far
		);

		const frustumCorners = MatrixUtils.getFrustumCornersWorldSpace(proj, camera.viewMatrix);
		const frustumCenter = Vec4.centroid(frustumCorners);

		// create a light view matrix from the light's direction and the view frustum center
		const lightDir = light.rotation.asDirectionVector.normalize();
		const lightView = Mat4.lookAt(frustumCenter.xyz.add(lightDir), frustumCenter.xyz, new Vec3(0, 1, 0));

		// get the min and max of the view frustum coordinates in light space to make the projection matrix
		let minCorner = Vec3.fromValue(Number.POSITIVE_INFINITY);
		let maxCorner = Vec3.fromValue(Number.NEGATIVE_INFINITY);

		for (const corner of frustumCorners) {
			const trf = lightView.multiplyByVec4(corner);

			minCorner = minCorner.min(trf);
			maxCorner = maxCorner.max(trf);
		}

		// multiply the Z to also include geometry behind the camera
		if (minCorner.z < 0) {
			minCorner.z *= this._zMult;
		} else {
			minCorner.z /= this._zMult;
		}

		if (maxCorner.z < 0) {
			maxCorner.z /= this._zMult;
		} else {
			maxCorner.z *= this._zMult;
		}

		// finally create the light's projection matrix
		const lightProjection = Mat4.ortho(
			minCorner.x,
			maxCorner.x,
			minCorner.y,
			maxCorner.y,
			minCorner.z,
			maxCorner.z,
		);
		const lightViewProj = lightProjection.multiply(lightView);
		return lightViewProj;
	}

	render(pool: RenderResourcePool) {
		// get corners and center of the view frustum
		const camera = pool.scene.activeCamera;
		if (!camera) return;

		pool.commandEncoder.pushDebugGroup('Light Renderer');

		// update light buffers
		pool.scene.info.updateLightBuffers();

		const rpe = pool.commandEncoder.beginRenderPass(this._depthPipeline.gpuRenderPassDescriptor);
		this._depthPipeline.defineRenderAttachments(pool);
		rpe.setPipeline(this._depthPipeline.gpuPipeline);
		this._depthPipeline.bindBindGroups(rpe, pool);

		for (const light of pool.scene.lights) {
			// if shadows are enabled
			if (game.engine.config.graphics.shadowMapQuality > 0) {
				// make sure all shadow-casting lights have their spot on the shadow map
				if (light.properties.castsShadows && !light.shadowAtlasMappedRegion) {
					// try to get a region on the shadow map for the light
					light.shadowAtlasMappedRegion =
						pool.shadowMapAtlas.requestMappedRegion({
							preferredSize: light.properties.shadowMapSize,
							canShrink: light.properties.shadowMapCanShrink,
						}) ?? undefined;
				}
			}
			// just remove any residual mapped region if shadows are disabled
			else {
				light.shadowAtlasMappedRegion = undefined;
			}

			// Render shadow maps
			// this time we only check "shadowAtlasMappedRegion" because "castsShadows" doesn't necessarily mean that
			// the light has a spot on the shadow map.
			if (light.shadowAtlasMappedRegion) {
				// set the pipeline viewport as the reserved region on the shadow atlas
				rpe.setViewport(
					light.shadowAtlasMappedRegion.lowerCorner.x,
					light.shadowAtlasMappedRegion.lowerCorner.y,
					light.shadowAtlasMappedRegion.size.x,
					light.shadowAtlasMappedRegion.size.y,
					0,
					1,
				);

				// for now, only directional lights are going to cast shadows
				if (light instanceof DirectionalLight) {
					const lightViewProj = this.getDirectionalLightViewProjMatrix(light, camera, pool.renderProjection);
					light.shadowMappingViewProj = lightViewProj;
					this._depthPipeline.writeToDepthCommonBuffer(lightViewProj);
					this._depthPipeline.render(rpe, pool.scene.entitiesToRender);
				}
			}
		}

		rpe.end();
		pool.commandEncoder.popDebugGroup();
	}

	free() {
		this._depthPipeline.free();
	}
}
