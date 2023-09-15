import { BadPipelineError } from "../../../errors/engine/render/bad_pipeline";
import { RenderInitializationResources } from "./render_initialization_resources";
import { RenderResourcePool } from "./render_resource_pool";
import { RenderStage } from "./render_stages/render_stage";
import { RenderStageDepthMap } from "./render_stages/rs_depth_map";
import { RenderStageLights } from "./render_stages/rs_lights";
import { RenderStageSolidGeometry } from "./render_stages/rs_solid_geometry";
import { RenderStageSkybox } from "./render_stages/rs_skybox";
import { RenderStagePFXToneMapping } from "./render_stages/rs_pfx_tone_mapping";
import { RenderStageBloom } from "./render_stages/rs_bloom";
import { RenderStageSSAO } from "./render_stages/rs_ssao";
import { RenderStagePicking } from "./render_stages/rs_picking";
import { RenderStageEnvironment } from "./render_stages/rs_environment";
import { RenderStageTAA } from "./render_stages/rs_taa";

export class VanillaRenderPipeline {

    private _rsDepthPass = new RenderStageDepthMap();
    private _rsLights = new RenderStageLights();
    private _rsSolidGeometry = new RenderStageSolidGeometry();
    private _rsSkybox = new RenderStageSkybox();
    private _rsTAA = new RenderStageTAA();
    private _rsSSAO = new RenderStageSSAO();
    private _rsEnvironment = new RenderStageEnvironment();
    private _rsBloom = new RenderStageBloom();
    private _rsPicking = new RenderStagePicking();

    private _rs_pfx_tonemap = new RenderStagePFXToneMapping();

    private _currentPipeline: RenderStage[] = [];

    buildPipeline() {
        this._currentPipeline = [
            this._rsDepthPass,
            this._rsLights,
            this._rsSolidGeometry,
            this._rsSkybox,
            this._rsSSAO,
            this._rsEnvironment,
            this._rsTAA,
            this._rsBloom,
            this._rs_pfx_tonemap,
            this._rsPicking
        ];
    }

    async initialize(resources: RenderInitializationResources) {
        for (const stage of this._currentPipeline) {
            await stage.initialize(resources);
        }
    }

    render(pool: RenderResourcePool) {
        if (this._currentPipeline.length <= 0) throw new BadPipelineError(`Trying to render with an invalid (no-stages) pipeline`);
        pool.commandEncoder.pushDebugGroup('Main Render Pipeline');
        this._currentPipeline.forEach(stage => stage.render(pool));
        pool.commandEncoder.popDebugGroup();
    }

    free() {
        this._currentPipeline.forEach(stage => stage.free());
        this._currentPipeline = [];
    }

}