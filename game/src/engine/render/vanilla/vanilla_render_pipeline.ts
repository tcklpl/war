import { BadPipelineError } from "../../../errors/engine/render/bad_pipeline";
import { RenderInitializationResources } from "./render_initialization_resources";
import { RenderResourcePool } from "./render_resource_pool";
import { RenderStage } from "./render_stages/render_stage";
import { RenderStageDepthMap } from "./render_stages/rs_depth_map";
import { RenderStageLights } from "./render_stages/rs_lights";
import { RenderStageSolidGeometry } from "./render_stages/rs_solid_geometry";
import { RenderStageSkybox } from "./render_stages/rs_skybox";
import { RenderStagePFXToneMapping } from "./render_stages/rs_pfx_tone_mapping";

export class VanillaRenderPipeline {

    private _rs0_depthPass = new RenderStageDepthMap();
    private _rs1_lights = new RenderStageLights();
    private _rs2_solid_geometry = new RenderStageSolidGeometry();
    private _rs3_skybox = new RenderStageSkybox();

    private _rs_pfx_tonemap = new RenderStagePFXToneMapping();

    private _currentPipeline: RenderStage[] = [];

    buildPipeline() {
        this._currentPipeline = [
            this._rs0_depthPass,
            this._rs1_lights,
            this._rs2_solid_geometry,
            this._rs3_skybox,
            this._rs_pfx_tonemap
        ];
    }

    async initialize(resources: RenderInitializationResources) {
        for (const stage of this._currentPipeline) {
            await stage.initialize(resources);
        }
    }

    render(pool: RenderResourcePool) {
        if (this._currentPipeline.length <= 0) throw new BadPipelineError(`Trying to render with an invalid (no-stages) pipeline`);
        this._currentPipeline.forEach(stage => stage.render(pool));
    }

    dispatchResizeCallback(resources: RenderInitializationResources) {
        this._currentPipeline.forEach(stage => {
            if (stage.resizeCallback) stage.resizeCallback(resources);
        });
    }

    free() {
        this._currentPipeline.forEach(stage => stage.free());
        this._currentPipeline = [];
    }

    get pbrStage() {
        return this._rs2_solid_geometry;
    }

}