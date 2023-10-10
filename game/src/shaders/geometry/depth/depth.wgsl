/*
    --------------------------------------------------------------------------------------------------
    Depth Shader

    This shader outputs only the depth of each fragment. Used for shadow mapping
    --------------------------------------------------------------------------------------------------
*/

/*
    Vertex uniforms what are common to every entity on the scane (on the same frame)
*/
struct VSCommonUniforms {
    view_projection: mat4x4f
};
@group(0) @binding(0) var<uniform> vsCommonUniforms: VSCommonUniforms;

/*
    Vertex uniforms that are unique to each entity
*/
struct VSUniqueUniforms {
    model: mat4x4f,
    model_inverse: mat4x4f,
    previous_model: mat4x4f,
    id: u32
};
@group(1) @binding(0) var<uniform> vsUniqueUniforms: VSUniqueUniforms;

@vertex
fn vertex(@location(0) position: vec3f) -> @builtin(position) vec4f {
    var worldPos = vsUniqueUniforms.model * vec4f(position, 1.0);
    var pos = vsCommonUniforms.view_projection * worldPos;

    return pos;
}

@fragment
fn fragment() {
}