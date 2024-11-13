import { Shader } from '../../shader';
import brdfDiffuse from './brdf/diffuse.wgsl?raw';
import brdfLobes from './brdf/lobes.wgsl?raw';
import brdfSpecular from './brdf/specular.wgsl?raw';
import constants from './constants.wgsl?raw';
import fragStructs from './frag_structs.wgsl?raw';
import fragmentShader from './fragment.wgsl?raw';
import lightDirectional from './light/directional.wgsl?raw';
import lightEval from './light/light_eval.wgsl?raw';
import lightPunctual from './light/punctual.wgsl?raw';
import lightShadows from './light/shadows.wgsl?raw';
import material from './material.wgsl?raw';
import overrides from './overrides.wgsl?raw';
import pixel from './pixel.wgsl?raw';
import surface from './surface.wgsl?raw';
import uniforms from './uniforms.wgsl?raw';
import utils from './utils.wgsl?raw';
import vertexShader from './vertex.wgsl?raw';

export class PrincipledBSDFShader extends Shader {
    static readonly BINDING_GROUPS = {
        VIEWPROJ: 0,
        MODEL: 1,
        MATERIAL: 2,
        SCENE_INFO: 3,
    };

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
            fragmentShader,
        );

        this.compileShader(shaderSource).then(() => cb());
    }
}
