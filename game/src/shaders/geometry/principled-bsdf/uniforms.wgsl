/*
    --------------------------------------------------------------------------------------------------
    Vertex Uniforms
    --------------------------------------------------------------------------------------------------
*/

// Vertex uniforms what are common to every entity on the scane (on the same frame)
@group(0) @binding(0) var<uniform> vsCommonUniforms: VSCommonUniforms;

// Vertex uniforms that are unique to each entity
@group(1) @binding(0) var<uniform> vsUniqueUniforms: VSUniqueUniforms;

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
struct DirectionalLights {
    count: u32,
    lights: array<DirectionalLightInfo, MAX_DIRECTIONAL_LIGHTS>
};
@group(3) @binding(0) var<uniform> directionalLights: DirectionalLights;

struct PointLights {
    count: u32,
    lights: array<PointLightInfo, MAX_POINT_LIGHTS>
};
@group(3) @binding(1) var<uniform> pointLights: PointLights;
@group(3) @binding(2) var sceneShadowAtlas: texture_depth_2d;

