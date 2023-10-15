/*
    --------------------------------------------------------------------------------------------------
    Principled BSDF Shader

    This Shader was based on the Learn OpenGL Tutorials and on the BSDF Implementation made by Google
    on the Filament engine.
    --------------------------------------------------------------------------------------------------
*/

const PI = 3.14159265359;
const MAX_DIRECTIONAL_LIGHTS = 2;

/*
    Vertex uniforms what are common to every entity on the scane (on the same frame)
*/
struct VSCommonUniforms {
    camera: mat4x4f,
    camera_inverse: mat4x4f,
    previous_camera: mat4x4f,
    projection: mat4x4f,
    previous_projection: mat4x4f,
    camera_position: vec3f,
    jitter: vec2f
};
@group(0) @binding(0) var<uniform> vsCommonUniforms: VSCommonUniforms;

/*
    Vertex uniforms that are unique to each entity
*/
struct VSUniqueUniforms {
    model: mat4x4f,
    model_inverse: mat4x4f,
    previous_model: mat4x4f,
    overlay: vec4f,
    id: u32
};
@group(1) @binding(0) var<uniform> vsUniqueUniforms: VSUniqueUniforms;

/*
    Vertex shader input from the 3d models
*/
struct VSInput {
    @location(0) position: vec3f,
    @location(1) uv: vec2f,
    @location(2) normal: vec3f,
    @location(3) tangent: vec4f
};

/*
    Values sent from the vertex shader to the fragment shader
*/
struct VSOutput {
    // NDC Vertex position and UV
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,

    // Position, normal, tangent and bitangent in model-space
    @location(1) model_position: vec3f,
    @location(2) model_normal: vec3f,
    @location(3) model_tangent: vec3f,
    @location(4) model_bitangent: vec3f,

    // Position in view-space. TEMPORARY, this position will be infered from the depth buffer
    @location(5) view_position: vec3f,

    // Matrix to transform normals into view-space. Used to write the normals to the normal buffer
    // in order to calculate SSAO and SSR later.
    @location(6) @interpolate(flat) normal_matrix_0: vec3f,
    @location(7) @interpolate(flat) normal_matrix_1: vec3f,
    @location(8) @interpolate(flat) normal_matrix_2: vec3f,
};

// Outputs from the fragment shader
struct FSOutput {
    @location(0) hdr_color: vec4f,
    @location(1) normal: vec4f,
    @location(2) specular: vec2f
};

fn multiplyNTBModel(v: vec3f) -> vec3f {
    return normalize((vsUniqueUniforms.model * vec4f(v, 0.0)).xyz);
}

@vertex
fn vertex(v: VSInput) -> VSOutput {
    var output: VSOutput;

    output.uv = v.uv;
    var worldPos = vsUniqueUniforms.model * vec4f(v.position, 1.0);
    var viewPos  = vsCommonUniforms.camera * worldPos;
    var pos      = vsCommonUniforms.projection * viewPos;

    pos += vec4f(vsCommonUniforms.jitter, 0.0, 0.0) * pos.w;

    output.model_position = vec3f(worldPos.xyz);
    output.view_position = viewPos.xyz;
    output.position = pos;

    var N = multiplyNTBModel(v.normal);
    var T = multiplyNTBModel(v.tangent.xyz);
    T = normalize(T - dot(T, N) * N);
    var B = cross(N, T);

    output.model_normal = N;
    output.model_tangent = T;
    output.model_bitangent = B;

    /* 
        Matrix to convert normals to view-space. Used to calculate SSAO and SSR later on.
        The original calculation was:

            transpose(invert(view * model))

        But, as wgsl doesn't have any invert function, I changed it to:

            transpose(model_inverse * view_inverse)

        Which is mathematically equivalent plus we don't need to invert matrices on the shader. 
    */
    var normalMatrix = transpose(vsUniqueUniforms.model_inverse * vsCommonUniforms.camera_inverse);
    // we split the matrix into 3 vec3f as for some reason I cannot pass a mat4x4f as a varying
    output.normal_matrix_0 = normalMatrix[0].xyz;
    output.normal_matrix_1 = normalMatrix[1].xyz;
    output.normal_matrix_2 = normalMatrix[2].xyz;

    return output;
}

/*
    --------------------------------------------------------------------------------------------------
    Common structs to be shared inside the shader
    --------------------------------------------------------------------------------------------------
*/

struct CommonVectors {
    N: vec3f,
    V: vec3f,
    NoV: f32,
    V_reflected_N: vec3f,
    Geometry_N: vec3f
}

struct CommonPositions {
    model_pos: vec3f
}

struct MaterialInputs {
    albedo: vec3f,
    metallic: f32,
    roughness: f32,
    ao: f32,
    ior: f32,

    clearCoat: f32,
    clearCoatRoughness: f32
}

struct PixelInfo {
    diffuse: vec3f,
    roughness: f32,
    f0: vec3f,

    clearCoat: f32,
    clearCoatRoughness: f32,

    dfg: vec3f, // IBL
    energyCompensation: vec3f
}

struct Light {
    color: vec4f,
    attenuation: f32,
    L: vec3f,
    NoL: f32
}

/*
    --------------------------------------------------------------------------------------------------
    Util Functions
    --------------------------------------------------------------------------------------------------
*/

fn IORtoF0(ior: f32) -> f32 {
    var division = (ior - 1.0) / (ior + 1.0);
    return division * division;
}

/*
    --------------------------------------------------------------------------------------------------
    Fragment Uniforms
    --------------------------------------------------------------------------------------------------
*/

// Material
@group(2) @binding(0) var matSampler: sampler;
@group(2) @binding(1) var matAlbedo: texture_2d<f32>;
@group(2) @binding(2) var matNormalAO: texture_2d<f32>;
@group(2) @binding(3) var matProps1: texture_2d<f32>;
@group(2) @binding(4) var matProps2: texture_2d<f32>;


// Scene Info - Shadow map atlas
@group(3) @binding(0) var sceneSampler: sampler;
@group(3) @binding(1) var sceneShadowAtlas: texture_depth_2d;

// Scene Info - Directional lights (like the sun)
struct DirectionalLightInfo {
    color: vec3f,
    direction: vec3f,
    intensity: f32,
    uv: vec4f,
    view_proj: mat4x4f
};
struct DirectionalLights {
    count: u32,
    lights: array<DirectionalLightInfo, MAX_DIRECTIONAL_LIGHTS>
};
@group(3) @binding(2) var<uniform> directionalLights: DirectionalLights;

// TODO: Scene Info - Punctual Lights


/*
    --------------------------------------------------------------------------------------------------
    Utility Functions
    --------------------------------------------------------------------------------------------------
*/

fn calculateNormal(uv: vec2f, normalSample: vec3f, normal: vec3f, tangent: vec3f, bitangent: vec3f) -> vec3f {
    var rawNormal = normalize(normalSample.rgb * 2.0 - 1.0);
    var tbn = mat3x3(
        tangent,
        bitangent,
        normal
    );
    return normalize(tbn * rawNormal);
}

/*
    --------------------------------------------------------------------------------------------------
    Specular BRDF Implementations
    --------------------------------------------------------------------------------------------------
*/

fn D_GGX(roughness: f32, NoH: f32, H: vec3f) -> f32 {
    var oneMinusNoH2 = 1.0 - (NoH * NoH);
    var a = NoH * roughness;
    var k = roughness / (oneMinusNoH2 + a * a);
    var d = k * k * (1.0 / PI);
    return saturate(d);
}

fn D_GGX_Anisotropic(at: f32, ab: f32, ToH: f32, BoH: f32, NoH: f32) -> f32 {
    var a2 = at * ab;
    var d = vec3f(ab * ToH, at * BoH, a2 * NoH);
    var d2 = dot(d, d);
    var b2 = a2 / d2;
    return a2 * b2 * b2 * (1.0 / PI);
}

fn V_SmithGGXCorrelated(roughness: f32, NoV: f32, NoL: f32) -> f32 {
    var a2 = roughness * roughness;
    var GGXl = NoV * sqrt((NoL - a2 * NoL) * NoL + a2);
    var GGXv = NoL * sqrt((NoV - a2 * NoV) * NoV + a2);
    var v = 0.5 / (GGXv + GGXl);
    return saturate(v);
}

fn V_SmithGGXCorrelated_Fast(roughness: f32, NoV: f32, NoL: f32) -> f32 {
    var v = 0.5 / mix(2.0 * NoL * NoV, NoL + NoV, roughness);
    return saturate(v);
}

fn V_SmithGGXCorrelated_Anisotropic(at: f32, ab: f32, ToV: f32, BoV: f32, ToL: f32, BoL: f32, NoV: f32, NoL: f32) -> f32 {
    var lambdaV = NoL * length(vec3(at * ToV, ab * BoV, NoV));
    var lambdaL = NoV * length(vec3(at * ToL, ab * BoL, NoL));
    var v = 0.5 / (lambdaV + lambdaL);
    return saturate(v);
}

fn V_Kelemen(LoH: f32) -> f32 {
    var v = 0.25 / (LoH * LoH);
    return saturate(v);
}

fn F_Schlick_F0vec3f_F90_VoH(f0: vec3f, f90: f32, VoH: f32) -> vec3f {
    return f0 + (f90 - f0) * pow(1.0 - VoH, 5.0);
}

fn F_Schlick_F0f32_F90_VoH(f0: f32, f90: f32, VoH: f32) -> f32 {
    return f0 + (f90 - f0) * pow(1.0 - VoH, 5.0);
}

fn F_Schlick_Roughness(f0: vec3f, roughness: f32, NoV: f32) -> vec3f {
    return f0 + (max(vec3f(1.0 - roughness), f0) - f0) * pow(saturate(1.0 - NoV), 5.0);
}

/*
    --------------------------------------------------------------------------------------------------
    Specular BRDF Dispatch
    --------------------------------------------------------------------------------------------------
*/

fn distribution(roughness: f32, NoH: f32, H: vec3f) -> f32 {
    return D_GGX(roughness, NoH, H);
}

fn distributionAnisotropic(at: f32, ab: f32, ToH: f32, BoH: f32, NoH: f32) -> f32 {
    return D_GGX_Anisotropic(at, ab, ToH, BoH, NoH);
}

fn distributionClearCoat(roughness: f32, NoH: f32, H: vec3f) -> f32 {
    return D_GGX(roughness, NoH, H);
}

fn visibility(roughness: f32, NoV: f32, NoL: f32) -> f32 {
    // can also be V_SmithGGXCorrelated_Fast
    // TODO: Shader quality control
    return V_SmithGGXCorrelated(roughness, NoV, NoL);
}

fn visibilityAnisotropic(roughness: f32, at: f32, ab: f32, ToV: f32, BoV: f32, ToL: f32, BoL: f32, NoV: f32, NoL: f32) -> f32 {
    return V_SmithGGXCorrelated_Anisotropic(at, ab, ToV, BoV, ToL, BoL, NoV, NoL);
}

fn visibilityClearCoat(LoH: f32) -> f32 {
    return V_Kelemen(LoH);
}

fn fresnel(f0: vec3f, LoH: f32) -> vec3f {
    var f90 = clamp(dot(f0, vec3f(50.0 * 0.33)), 0.0, 1.0);
    return F_Schlick_F0vec3f_F90_VoH(f0, f90, LoH);
}


/*
    --------------------------------------------------------------------------------------------------
    Diffuse BRDF Implementations
    --------------------------------------------------------------------------------------------------
*/

fn Fd_Lambert() -> f32 {
    return 1.0 / PI;
}

fn Fd_Burley(roughness: f32, NoV: f32, NoL: f32, LoH: f32) -> f32 {
    var f90 = 0.5 + 2.0 * roughness * LoH * LoH;
    var lightScatter = F_Schlick_F0f32_F90_VoH(1.0, f90, NoL);
    var viewScatter = F_Schlick_F0f32_F90_VoH(1.0, f90, NoV);
    return lightScatter * viewScatter * (1.0 / PI);
}

/*
    --------------------------------------------------------------------------------------------------
    Diffuse BRDF Dispatch
    --------------------------------------------------------------------------------------------------
*/

fn diffuse(roughness: f32, NoV: f32, NoL: f32, LoH: f32) -> f32 {
    // can also be Fd_Lambert
    // TODO: Shader quality control
    return Fd_Burley(roughness, NoV, NoL, LoH);
}

/*
    --------------------------------------------------------------------------------------------------
    Lobes
    --------------------------------------------------------------------------------------------------
*/

fn clearCoatLobe(pixel: PixelInfo, H: vec3f, NoH: f32, LoH: f32, Fcc: ptr<function, f32>) -> f32 {
    var D = distributionClearCoat(pixel.clearCoatRoughness, NoH, H);
    var V = visibilityClearCoat(LoH);
    var F = F_Schlick_F0f32_F90_VoH(0.04, 1.0, LoH) * pixel.clearCoat;
    (*Fcc) = F;
    return D * V * F;
}

fn isotropicLobe(pixel: PixelInfo, H: vec3f, NoV: f32, NoL: f32, NoH: f32, LoH: f32) -> vec3f {
    var D = distribution(pixel.roughness, NoH, H);
    var V = visibility(pixel.roughness, NoV, NoL);
    var F = fresnel(pixel.f0, LoH);
    return (D * V) * F;
}

fn specularLobe(pixel: PixelInfo, H: vec3f, NoV: f32, NoL: f32, NoH: f32, LoH: f32) -> vec3f {
    return isotropicLobe(pixel, H, NoV, NoL, NoH, LoH);
}

fn diffuseLobe(pixel: PixelInfo, NoV: f32, NoL: f32, LoH: f32) -> vec3f {
    return pixel.diffuse * diffuse(pixel.roughness, NoV, NoL, LoH);
}

/*
    --------------------------------------------------------------------------------------------------
    Surface Shading
    --------------------------------------------------------------------------------------------------
*/

fn surfaceShading(pixel: PixelInfo, light: Light, cv: CommonVectors, occlusion: f32) -> vec3f {
    var H = normalize(cv.V + light.L);

    var NoV = cv.NoV;
    var NoL = saturate(light.NoL);
    var NoH = saturate(dot(cv.N, H));
    var LoH = saturate(dot(light.L, H));

    var Fr = specularLobe(pixel, H, NoV, NoL, NoH, LoH);
    var Fd = diffuseLobe(pixel, NoV, NoL, LoH);

    var color = Fd + Fr * pixel.energyCompensation;

    // // Clear Coat
    // var Fcc = 0.0;
    // var clearCoatNoH = saturate(dot(cv.Geometry_N, H));
    // var clearCoatNoL = saturate(dot(cv.Geometry_N, H));
    // var Cc = clearCoatLobe(pixel, H, clearCoatNoH, LoH, &Fcc);
    // var attenuation = 1.0 - Fcc;

    // color *= attenuation * NoL;
    // color += pixel.clearCoat * clearCoatNoL;
    // // End of clear coat

    // return  (color * light.color.rgb) * (light.color.w * light.attenuation * occlusion);

    return (color * light.color.rgb) * (light.color.w * light.attenuation * NoL * occlusion);
}

/*
    --------------------------------------------------------------------------------------------------
    Light Manipulation
    --------------------------------------------------------------------------------------------------
*/

fn evaluateShadowMappingFromAtlas(cv: CommonVectors, L: vec3f, model_pos: vec3f, uv_min: vec2f, uv_max: vec2f, view_proj: mat4x4f) -> f32 {
    // get light projection from model position
    var fragPosLightSpace = view_proj * vec4f(model_pos, 1.0);
    // perspective divide
    var projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    // transform to [0, 1] range
    var projUV = projCoords.xyz * 0.5 + 0.5;
    projUV.y = 1.0 - projUV.y;
    // remap to shadow atlas region
    var uvDiff = uv_max - uv_min;
    var uvOffset = projUV.xy * uvDiff;
    var atlasUV = uv_min + uvOffset;

    // depth of the current fragment from light's perspective
    var currentDepth = projCoords.z;

    // calculate bias (based on slope)
    var bias = max(0.05 * (1.0 - dot(cv.N, L)), 0.005);
    var biasModifier = 0.5;
    bias *= biasModifier;
    // bias *= 1.0 / (20.0 * biasModifier);

    // PCF
    var shadow = 0.0;
    var texelSize = 1.0 / vec2f(textureDimensions(sceneShadowAtlas));
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            var offset = vec2f(f32(x), f32(y)) * texelSize;
            var pcfDepth = textureSample(sceneShadowAtlas, sceneSampler, atlasUV.xy + offset);
            shadow += select(0.0, 1.0, (currentDepth - bias) > pcfDepth);
        }
    }
    shadow /= 9.0;

    // keep the shadow at 0.0 when outside the far_plane region of the light's frustum.
    // this cannot be done early because wgsl doesn't allow texture sampling in a non-uniform control flow.
    if (currentDepth < 0.0 || currentDepth > 1.0) {
        shadow = 0.0;
    }

    return shadow;
}

fn directionalLightAsDiscAreaLight(cv: CommonVectors, direction: vec3f) -> vec3f {
    var LoR = dot(direction, cv.V_reflected_N);
    var d = direction.x;
    var s = cv.V_reflected_N - LoR * direction;
    return normalize(direction * d + normalize(s) * direction.y);
    // if (LoR < d) {
    //     return normalize(direction * d + normalize(s) * direction.y);
    // } else {
    //     return cv.V_reflected_N;
    // }
}

fn evaluateDirectionalLights(pixel: PixelInfo, cv: CommonVectors, cp: CommonPositions) -> vec3f {

    var color = vec3f(0.0);
    for (var i = 0u; i < directionalLights.count; i++) {

        var L = normalize(-directionalLights.lights[i].direction);
        var intensity = log2(directionalLights.lights[i].intensity); // idk

        // Shadow mapping
        var visibility = 1.0;
        // if the shadow map is not present all values in the vec4f will be -1.0.
        // I'll only check the first one because no valid UV would be < 0
        if (directionalLights.lights[i].uv.x != -1.0) {
            var shadow = evaluateShadowMappingFromAtlas(
                cv,
                L,
                cp.model_pos,
                directionalLights.lights[i].uv.xy,
                directionalLights.lights[i].uv.zw,
                directionalLights.lights[i].view_proj
            );
            visibility = 1.0 - shadow;
        }

        // TODO: actually load light intensity
        var light = Light(
            vec4f(directionalLights.lights[i].color, intensity),  // color
            1.0,                                            // attenuation
            L,                                              // light vector
            saturate(dot(cv.N, L))                          // NoL
        );

        color += surfaceShading(pixel, light, cv, visibility);
    }

    return color;
}

/*
    --------------------------------------------------------------------------------------------------
    Pixel Params and Remapping
    --------------------------------------------------------------------------------------------------
*/

fn getMaterialParams(mat: MaterialInputs, pixel: ptr<function, PixelInfo>) {

    (*pixel).diffuse = (1.0 - mat.metallic) * mat.albedo.rgb;
    (*pixel).f0 = vec3f(IORtoF0(mat.ior));
    (*pixel).roughness = mat.roughness * mat.roughness;

}

fn getClearCoatParams(mat: MaterialInputs, pixel: ptr<function, PixelInfo>) {
    (*pixel).clearCoat = mat.clearCoat;
    (*pixel).clearCoatRoughness = mat.clearCoatRoughness * mat.clearCoatRoughness;
}

fn getEnergyCompensationParams(pixel: ptr<function, PixelInfo>) {
    // will be replaced with IBL
    (*pixel).dfg = vec3f(1.0);
    (*pixel).energyCompensation = 1.0 + (*pixel).f0 * (1.0 / (*pixel).dfg.y - 1.0);
}

fn getPixelParams(mat: MaterialInputs) -> PixelInfo {
    var pixel: PixelInfo;
    getMaterialParams(mat, &pixel);
    getClearCoatParams(mat, &pixel);
    getEnergyCompensationParams(&pixel);
    return pixel;
}

/*
    --------------------------------------------------------------------------------------------------
    Main Functions
    --------------------------------------------------------------------------------------------------
*/

fn evaluateLights(mat: MaterialInputs, pixel: PixelInfo, cv: CommonVectors, cp: CommonPositions) -> vec4f {

    var color = vec3f(0.0);

    // IBL was delegated to the environment shader
    color += evaluateDirectionalLights(pixel, cv, cp);
    // TODO: Punctual Lights (point and spot)

    return vec4f(color, 1.0);
}

fn evaluateMaterial(mat: MaterialInputs, pixel: PixelInfo, cv: CommonVectors, cp: CommonPositions) -> vec4f {
    return evaluateLights(mat, pixel, cv, cp);
}


@fragment
fn fragment(v: VSOutput) -> FSOutput {

    /*
        Material Information:

        Texture Name    Format          Separation          Data Explanation
        -------------------------------------------------------------------------------
        Albedo          rgba16float     [r, g, b, a]¹       1: Material HDR color.

        Normal          rgba8unorm      [r, g, b]¹ [a]²     1: Normal vector;
                                                            2: AO.

        Props 1         rgba8unorm      [r]¹ [g]² [b]³ [a]⁴ 1: Metallic;
                                                            2: Roughness;
                                                            3: Transmission;
                                                            4: Transmission Roughness;

        Props 2         r16float        [r]¹                1: IOR

    */
    // albedo
    var albedoSample = textureSample(matAlbedo, matSampler, v.uv);
    var albedo = pow(albedoSample.rgb, vec3f(2.2));
    var alpha = albedoSample.a;

    // overlay
    var overlayColor = vsUniqueUniforms.overlay.rgb;
    var overlayIntensity = vsUniqueUniforms.overlay.a;
    albedo = mix(albedo, overlayColor, overlayIntensity);

    // normal and AO
    var normalAOSample = textureSample(matNormalAO, matSampler, v.uv);
    var normalMapVector = normalAOSample.xyz;
    var ao = normalAOSample.a;

    // props 1
    var props1Sample = textureSample(matProps1, matSampler, v.uv);
    var metallic = props1Sample.r;
    var roughness = props1Sample.g;
    var transmission = props1Sample.b;
    var transmissionRoughness = props1Sample.a;

    // props 2
    var props2Sample = textureSample(matProps2, matSampler, v.uv);
    var ior = props2Sample.r;

    // unused props, maybe use if in the future?
    var clearCoat = 0.0;
    var clearCoatPerceptualRoughness = 0.0;

    // getting parameters
    var normal = calculateNormal(v.uv, normalMapVector, v.model_normal, v.model_tangent, v.model_bitangent);
    var viewVector = normalize(vsCommonUniforms.camera_position - v.model_position.xyz);

    var cv = CommonVectors(
        normal,                                 // N
        viewVector,                             // V
        saturate(dot(normal, viewVector)),      // NoV
        reflect(-viewVector, normal),           // V_reflected_N
        v.model_normal                          // Geometry_N
    );

    var cp = CommonPositions(
        v.model_position.xyz                    // model position
    );

    var mat = MaterialInputs(
        albedo,
        metallic,
        roughness,
        ao,
        ior,
        clearCoat,
        clearCoatPerceptualRoughness
    );

    var pixel = getPixelParams(mat);

    var color = evaluateMaterial(mat, pixel, cv, cp);

    // reconstruct the normal matrix (transpose of inverse of model * view)
    var normalMatrix = mat3x3f(v.normal_matrix_0, v.normal_matrix_1, v.normal_matrix_2);
    // multiply the normal by the inverse of the model matrix to get the original vectors again
    // as all the lighting calculation is done in model-space
    var normalConversion = (vsUniqueUniforms.model_inverse * vec4f(normal, 0.0)).xyz;

    var kS = F_Schlick_Roughness(pixel.f0, pixel.roughness, cv.NoV).r;

    var output: FSOutput;
    output.hdr_color = color;
    output.normal = vec4f((normalMatrix * normalConversion) * 0.5 + 0.5, 1.0); // map normals from [-1, 1] to [0, 1] to save in a rgba8 texture
    output.specular = vec2f(kS, pixel.roughness); // specular and roughness to the environment shader

    return output;
}