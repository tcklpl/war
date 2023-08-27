import { BadPipelineError } from "../../../errors/engine/render/bad_pipeline";
import { RenderInitializationResources } from "./render_initialization_resources";
import { RenderResourcePool } from "./render_resource_pool";
import { RenderStage } from "./render_stages/render_stage";
import { RenderStageDepthMap } from "./render_stages/rs0_depth_map";
import { RenderStageLights } from "./render_stages/rs1_lights";
import { RenderStageSolidGeometry } from "./render_stages/rs2_solid_geometry";

export class VanillaRenderPipeline {

    private _rs0_depthPass = new RenderStageDepthMap();
    private _rs1_lights = new RenderStageLights();
    private _rs2_solid_geometry = new RenderStageSolidGeometry();

    private _currentPipeline: RenderStage[] = [];

    buildPipeline() {
        this._currentPipeline = [
            this._rs0_depthPass,
            this._rs1_lights,
            this._rs2_solid_geometry
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

    free() {
        this._currentPipeline.forEach(stage => stage.free());
        this._currentPipeline = [];
    }

    get pbrStage() {
        return this._rs2_solid_geometry;
    }

}