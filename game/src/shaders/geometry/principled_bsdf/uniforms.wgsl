/*
    --------------------------------------------------------------------------------------------------
    Vertex Uniforms
    --------------------------------------------------------------------------------------------------
*/

// Vertex uniforms what are common to every entity on the scane (on the same frame)
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

// Vertex uniforms that are unique to each entity
struct VSUniqueUniforms {
    model: mat4x4f,
    model_inverse: mat4x4f,
    previous_model: mat4x4f,
    overlay: vec4f,
    id: u32
};
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
@group(3) @binding(0) var sceneSampler: sampler;
@group(3) @binding(1) var sceneShadowAtlas: texture_depth_2d;

struct DirectionalLights {
    count: u32,
    lights: array<DirectionalLightInfo, MAX_DIRECTIONAL_LIGHTS>
};
@group(3) @binding(2) var<uniform> directionalLights: DirectionalLights;

struct PointLights {
    count: u32,
    lights: array<PointLightInfo, MAX_POINT_LIGHTS>
};
@group(3) @binding(3) var<uniform> pointLights: PointLights;
