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
    energyCompensation: vec3f,

    uv: vec2f
}

struct Light {
    color: vec4f,
    attenuation: f32,
    L: vec3f,
    NoL: f32
}

// Scene Info - Directional lights (like the sun)
struct DirectionalLightInfo {
    color: vec3f,
    radius: f32,
    direction: vec3f,
    intensity: f32,
    uv: vec4f,
    view_proj: mat4x4f
};

// Scene Info - Point Lights
struct PointLightInfo {
    color: vec3f,
    intensity: f32,
    position: vec3f
};

struct ShadowCalcParams {
    light_projected_depth: f32,
    light_radius: f32,
    bias: f32,
    atlas_uv: vec2f,
    atlas_uv_region_min: vec2f,
    atlas_uv_region_max: vec2f,
    texel_size: vec2f,
    global_uv: vec2f,
}
