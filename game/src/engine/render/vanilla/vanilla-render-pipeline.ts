import { BadPipelineError } from '../../../errors/engine/render/bad-pipeline';
import type { ConfigGraphics } from '../../config/cfg-graphics';
import type { RenderInitializationResources } from './render-initialization-resources';
import type { RenderResourcePool } from './render-resource-pool';
import type { RenderStage } from './render-stages/render-stage';
import { RenderStageBloom } from './render-stages/rs-bloom';
import { RenderStageEnvironment } from './render-stages/rs-environment';
import { RenderStageExposureCalculation } from './render-stages/rs-exposure-calculation';
import { RenderStageLights } from './render-stages/rs-lights';
import { RenderStageOutline } from './render-stages/rs-outline';
import { RenderStageOutlineMask } from './render-stages/rs-outline-mask';
import { RenderStagePFXToneMapping } from './render-stages/rs-pfx-tone-mapping';
import { RenderStagePicking } from './render-stages/rs-picking';
import { RenderStagePrePass } from './render-stages/rs-prepass';
import { RenderStageSkybox } from './render-stages/rs-skybox';
import { RenderStageSolidGeometry } from './render-stages/rs-solid-geometry';
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

	async initialize(resources: RenderInitializationResources) {
		for (const stage of this._currentPipeline) {
			await stage.initialize(resources);
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
