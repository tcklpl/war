import { BadPipelineError } from '../../../errors/engine/render/bad_pipeline';
import { ConfigGraphics } from '../../config/cfg_graphics';
import { RenderInitializationResources } from './render_initialization_resources';
import { RenderResourcePool } from './render_resource_pool';
import { RenderStage } from './render_stages/render_stage';
import { RenderStageBloom } from './render_stages/rs_bloom';
import { RenderStageEnvironment } from './render_stages/rs_environment';
import { RenderStageExposureCalculation } from './render_stages/rs_exposure_calculation';
import { RenderStageLights } from './render_stages/rs_lights';
import { RenderStageOutline } from './render_stages/rs_outline';
import { RenderStagePFXToneMapping } from './render_stages/rs_pfx_tone_mapping';
import { RenderStagePicking } from './render_stages/rs_picking';
import { RenderStagePrePass } from './render_stages/rs_prepass';
import { RenderStageSkybox } from './render_stages/rs_skybox';
import { RenderStageSolidGeometry } from './render_stages/rs_solid_geometry';
import { RenderStageSSAO } from './render_stages/rs_ssao';
import { RenderStageTAA } from './render_stages/rs_taa';

export class VanillaRenderPipeline {
    private readonly _rsPrepass = new RenderStagePrePass();
    private readonly _rsLights = new RenderStageLights();
    private readonly _rsSolidGeometry = new RenderStageSolidGeometry();
    private readonly _rsSkybox = new RenderStageSkybox();
    private readonly _rsExposureCalculation = new RenderStageExposureCalculation();
    private readonly _rsSSAO = new RenderStageSSAO();
    private readonly _rsEnvironment = new RenderStageEnvironment();
    private readonly _rsTAA = new RenderStageTAA();
    private readonly _rsBloom = new RenderStageBloom();
    private readonly _rsOutline = new RenderStageOutline();
    private readonly _rs_pfx_tonemap = new RenderStagePFXToneMapping();
    private readonly _rsPicking = new RenderStagePicking();

    private _currentPipeline: RenderStage[] = [];

    buildPipeline(graphicsConfig: ConfigGraphics) {
        this._currentPipeline = [
            this._rsPrepass,
            this._rsLights,
            this._rsSolidGeometry,
            this._rsSkybox,
            ...(graphicsConfig.useSSAO ? [this._rsSSAO] : []),
            this._rsEnvironment,
            ...(graphicsConfig.useTAA ? [this._rsTAA] : []),
            ...(graphicsConfig.useBloom ? [this._rsBloom] : []),
            this._rsExposureCalculation,
            this._rsOutline,
            this._rs_pfx_tonemap,
            this._rsPicking,
        ];
    }

    async initialize(resources: RenderInitializationResources) {
        for (const stage of this._currentPipeline) {
            await stage.initialize(resources);
        }
    }

    render(pool: RenderResourcePool) {
        if (this._currentPipeline.length <= 0)
            throw new BadPipelineError(`Trying to render with an invalid (no-stages) pipeline`);
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
