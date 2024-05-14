import { Shader } from "../../shader";
import constants from "./constants.wgsl";
import overrides from "./overrides.wgsl";
import uniforms from "./uniforms.wgsl";
import utils from "./utils.wgsl";
import vertexShader from "./vertex.wgsl";
import fragStructs from "./frag_structs.wgsl";
import brdfSpecular from "./brdf/specular.wgsl";
import brdfDiffuse from "./brdf/diffuse.wgsl";
import brdfLobes from "./brdf/lobes.wgsl";
import surface from "./surface.wgsl";
import lightShadows from "./light/shadows.wgsl";
import lightDirectional from "./light/directional.wgsl";
import lightPunctual from "./light/punctual.wgsl";
import lightEval from "./light/light_eval.wgsl";
import material from "./material.wgsl";
import pixel from "./pixel.wgsl";
import fragmentShader from "./fragment.wgsl";

export class PrincipledBSDFShader extends Shader {

    static readonly BINDING_GROUPS = {
        VIEWPROJ: 0,
        MODEL: 1,
        MATERIAL: 2,
        SCENE_INFO: 3
    }

    constructor(name: string, cb: () => void) {
        super(name);

        const shaderSource = ''.concat(
            constants,
            overrides,
            uniforms,
            utils,

            vertexShader,

            fragStructs,
            brdfSpecular,
            brdfDiffuse,
            brdfLobes,
            surface,

            lightShadows,
            lightDirectional,
            lightPunctual,
            lightEval,

            material,
            pixel,
            fragmentShader
        );

        this.compileShader(shaderSource).then(() => cb());
    }

}