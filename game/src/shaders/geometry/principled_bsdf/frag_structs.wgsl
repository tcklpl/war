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

// Scene Info - Directional lights (like the sun)
struct DirectionalLightInfo {
    color: vec3f,
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
