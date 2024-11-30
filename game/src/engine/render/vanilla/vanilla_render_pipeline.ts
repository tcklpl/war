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
import { RenderStageOutlineMask } from './render_stages/rs_outline_mask';
import { RenderStagePFXToneMapping } from './render_stages/rs_pfx_tone_mapping';
import { RenderStagePicking } from './render_stages/rs_picking';
import { RenderStagePrePass } from './render_stages/rs_prepass';
import { RenderStageSkybox } from './render_stages/rs_skybox';
import { RenderStageSolidGeometry } from './render_stages/rs_solid_geometry';
import { RenderStageSSAO } from './render_stages/rs_ssao';
import { RenderStageTAA } from './render_stages/rs_taa';

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
