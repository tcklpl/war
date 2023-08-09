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
    projection: mat4x4f,
    camera_position: vec3f
};
@group(0) @binding(0) var<uniform> vsCommonUniforms: VSCommonUniforms;

/*
    Vertex uniforms that are unique to each entity
*/
struct VSUniqueUniforms {
    model: mat4x4f
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
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
    @location(1) model_position: vec3f,
    @location(2) model_normal: vec3f,
    @location(3) model_tangent: vec3f,
    @location(4) model_bitangent: vec3f
};

fn multiplyNTBModel(v: vec3f) -> vec3f {
    return normalize((vsUniqueUniforms.model * vec4f(v, 0.0)).xyz);
}

@vertex
fn vertex(v: VSInput) -> VSOutput {
    var output: VSOutput;

    output.uv = v.uv;
    var worldPos = vsUniqueUniforms.model * vec4f(v.position, 1.0);
    output.model_position = vec3f(worldPos.xyz);
    output.position = vsCommonUniforms.projection * vsCommonUniforms.camera * worldPos;

    var bitangent = normalize(cross(v.normal, v.tangent.xyz) * v.tangent.w);
    var N = multiplyNTBModel(v.normal);
    var T = multiplyNTBModel(v.tangent.xyz);
    T = normalize(T - dot(T, N) * N);
    var B = cross(N, T);

    output.model_normal = N;
    output.model_tangent = T;
    output.model_bitangent = B;


    return output;
}

/*
    Fragment Shader Material uniforms
*/
@group(2) @binding(0) var matSampler: sampler;
@group(2) @binding(1) var matAlbedo: texture_2d<f32>;
@group(2) @binding(2) var matNormal: texture_2d<f32>;
@group(2) @binding(3) var matMetallic: texture_2d<f32>;
@group(2) @binding(4) var matRoughness: texture_2d<f32>;
@group(2) @binding(5) var matAO: texture_2d<f32>;

/*
    --------------------------------------------------------------------------------------------------
    Common structs to be shared inside the shader
    --------------------------------------------------------------------------------------------------
*/

struct CommonVectors {
    N: vec3f,
    V: vec3f,
    NoV: f32,
    V_reflected_N: vec3f
}

struct MaterialInputs {
    albedo: vec3f,
    metallic: f32,
    roughness: f32,
    reflectance: f32,
    ao: f32,

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
    Directional lights (like the sun)
*/
struct DirectionalLightInfo {
    color: vec3f,
    direction: vec3f,
    intensity: f32
};
struct DirectionalLights {
    count: u32,
    lights: array<DirectionalLightInfo, MAX_DIRECTIONAL_LIGHTS>
};
@group(3) @binding(0) var<uniform> directionalLights: DirectionalLights;

/*
    --------------------------------------------------------------------------------------------------
    Utility Functions
    --------------------------------------------------------------------------------------------------
*/

fn saturate(v: f32) -> f32 {
    return clamp(v, 0.0, 1.0);
}

fn calculateNormal(uv: vec2f, normal: vec3f, tangent: vec3f, bitangent: vec3f) -> vec3f {
    var normalSample = textureSample(matNormal, matSampler, uv);
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

fn F_Schlick_F0vec3f_VoH(F0: vec3f, VoH: f32) -> vec3f {
    var f = pow(1.0 - VoH, 5.0);
    return f + F0 * (1.0 - f);
}

fn F_Schlick_F0f32_F90_VoH(f0: f32, f90: f32, VoH: f32) -> f32 {
    return f0 + (f90 - f0) * pow(1.0 - VoH, 5.0);
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

fn clearCoatLobe(pixel: PixelInfo, H: vec3f, NoH: f32, LoH: f32) -> f32 {
    var D = distributionClearCoat(pixel.clearCoatRoughness, NoH, H);
    var V = visibilityClearCoat(LoH);
    var F = F_Schlick_F0f32_F90_VoH(0.04, 1.0, LoH) * pixel.clearCoat;
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

    // TODO: clearcoat

    return (color * light.color.rgb) * (light.color.w * light.attenuation * NoL * occlusion);
}

/*
    --------------------------------------------------------------------------------------------------
    Light Manipulation
    --------------------------------------------------------------------------------------------------
*/

fn directionalLightAsAreaLight(cv: CommonVectors, direction: vec3f) {
    var LoR = dot(direction, cv.V_reflected_N);
}

fn evaluateDirectionalLights(pixel: PixelInfo, cv: CommonVectors) -> vec3f {

    var color = vec3f(0.0);
    for (var i = 0u; i < directionalLights.count; i++) {

        var L = normalize(-directionalLights.lights[i].direction);
        var visibility = 1.0; // shadow mapping

        // TODO: actually load light intensity
        var light = Light(
            vec4f(directionalLights.lights[i].color, 4.0),  // color
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
    // TODO: get F0 from ior
    (*pixel).f0 = 0.16 * mat.reflectance * mat.reflectance * (1.0 - mat.metallic) + mat.albedo.rgb * mat.metallic;
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

fn evaluateLights(mat: MaterialInputs, cv: CommonVectors) -> vec4f {
    var pixel = getPixelParams(mat);

    var color = vec3f(0.0);

    // TODO: IBL
    color += evaluateDirectionalLights(pixel, cv);
    // TODO: Punctual Lights (point and spot)

    return vec4f(color, 1.0);
}

fn evaluateMaterial(mat: MaterialInputs, cv: CommonVectors) -> vec4f {
    return evaluateLights(mat, cv);
}


@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    // getting parameters
    var normal = calculateNormal(v.uv, v.model_normal, v.model_tangent, v.model_bitangent);
    var viewVector = normalize((vsCommonUniforms.camera_position - v.model_position.xyz));

    var albedo = pow(textureSample(matAlbedo, matSampler, v.uv).rgb, vec3f(2.2));
    var metallic = textureSample(matMetallic, matSampler, v.uv).r;
    var roughness = textureSample(matRoughness, matSampler, v.uv).r;
    var ao = textureSample(matAO, matSampler, v.uv).r;
    // TODO: actually load these from a texture
    var reflectance = 1.0;
    var clearCoat = 0.0;
    var clearCoatPerceptualRoughness  = 0.0;

    // normal = v.model_normal;

    var cv = CommonVectors(
        normal,                                 // N
        viewVector,                             // V
        saturate(dot(normal, viewVector)),      // NoV
        reflect(-viewVector, normal)            // V_reflected_N
    );

    var mat = MaterialInputs(
        albedo,
        metallic,
        roughness,
        reflectance,
        ao,
        clearCoat,
        clearCoatPerceptualRoughness
    );

    var color = evaluateMaterial(mat, cv);

    return color;
}