/*
    --------------------------------------------------------------------------------------------------
    Picking Shader

    This Shader render each entity id as a u32 to a target 1x1 texture
    --------------------------------------------------------------------------------------------------
*/

/*
    Vertex uniforms what are common to every entity on the scane (on the same frame)
*/
struct VSCommonUniforms {
    view: mat4x4f,
    projection: mat4x4f,
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
    @location(0) position: vec3f
};

/*
    Values sent from the vertex shader to the fragment shader
*/
struct VSOutput {
    // NDC Vertex position and UV
    @builtin(position) position: vec4f
};

@vertex
fn vertex(v: VSInput) -> VSOutput {
    var output: VSOutput;
    var worldPos = vsUniqueUniforms.model * vec4f(v.position, 1.0);
    var viewPos  = vsCommonUniforms.view * worldPos;
    output.position = vsCommonUniforms.projection * viewPos;
    return output;
}

@fragment
fn fragment(v: VSOutput) -> @location(0) u32 {
    return vsUniqueUniforms.id;
}