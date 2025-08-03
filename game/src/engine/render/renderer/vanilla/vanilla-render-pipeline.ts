import type { ConfigGraphics } from ':engine/config/cfg-graphics';
import { BadPipelineError } from '../../../../errors/engine/render/bad-pipeline';
import type { RenderResourcePool } from './render-resource-pool';
import { RenderStageLights } from './render-stages/geometry/lights.render-stage';
import { RenderStagePicking } from './render-stages/geometry/picking.render-stage';
import { RenderStagePrePass } from './render-stages/geometry/prepass.render-stage';
import { RenderStageSolidGeometry } from './render-stages/geometry/solid-geometry.render-stage';
import { RenderStageBloom } from './render-stages/post/bloom.render-stage';
import { RenderStageExposureCalculation } from './render-stages/post/exposure-calculation.render-stage';
import { RenderStageSkybox } from './render-stages/post/skybox.render-stage';
import type { RenderStage } from './render-stages/render-stage';
import { RenderStageEnvironment } from './render-stages/rs-environment';
import { RenderStageOutline } from './render-stages/rs-outline';
import { RenderStageOutlineMask } from './render-stages/rs-outline-mask';
import { RenderStagePFXToneMapping } from './render-stages/rs-pfx-tone-mapping';
import { RenderStageSSAO } from './render-stages/rs-ssao';
import { RenderStageTAA } from './render-stages/rs-taa';

export class VanillaRenderPipeline {
	private _currentPipeline: RenderStage[] = [];

	buildPipeline(graphicsConfig: ConfigGraphics) {
		const rsPrepass = new RenderStagePrePass();
		const rsLights = new RenderStageLights();
		const rsSolidGeometry = new RenderStageSolidGeometry();
		const rsSkybox = new RenderStageSkybox();
		const rsExposureCalculation = new RenderStageExposureCalculation();
		const rsSSAO = new RenderStageSSAO();
		const rsEnvironment = new RenderStageEnvironment();
		const rsTAA = new RenderStageTAA();
		const rsBloom = new RenderStageBloom();
		const rsOutlineMask = new RenderStageOutlineMask();
		const rsOutline = new RenderStageOutline();
		const rs_pfx_tonemap = new RenderStagePFXToneMapping();
		const rsPicking = new RenderStagePicking();

		this._currentPipeline = [
			rsPrepass,
			rsLights,
			rsSolidGeometry,
			rsSkybox,
			...(graphicsConfig.useSSAO ? [rsSSAO] : []),
			rsEnvironment,
			...(graphicsConfig.useTAA ? [rsTAA] : []),
			...(graphicsConfig.useBloom ? [rsBloom] : []),
			rsExposureCalculation,
			rsOutlineMask,
			rsOutline,
			rs_pfx_tonemap,
			rsPicking,
		];
	}

	async initialize(resources: RenderResourcePool) {
		for (const stage of this._currentPipeline) {
			await stage.initialize?.(resources);
		}
	}

	render(pool: RenderResourcePool) {
		if (this._currentPipeline.length <= 0)
			throw new BadPipelineError('Trying to render with an invalid (no-stages) pipeline');
		pool.commandEncoder.pushDebugGroup('Main Render Pipeline');
		this._currentPipeline.forEach(stage => stage.render(pool));
		pool.commandEncoder.popDebugGroup();
	}

	free() {
		this._currentPipeline.forEach(stage => stage.free?.());
		this._currentPipeline = [];
	}

	dispatchResolutionUpdate(pool: RenderResourcePool) {
		this._currentPipeline.forEach(stage => stage.onScreenResize?.(pool));
	}
}
