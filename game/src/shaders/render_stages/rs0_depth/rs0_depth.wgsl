/*
    --------------------------------------------------------------------------------------------------
    Depth Shader
    --------------------------------------------------------------------------------------------------
*/

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
    @location(0) position: vec3f
};

/*
    Values sent from the vertex shader to the fragment shader
*/
struct VSOutput {
    @builtin(position) position: vec4f
};

@vertex
fn vertex(v: VSInput) -> VSOutput {
    var output: VSOutput;
    output.position = vsCommonUniforms.projection * vsCommonUniforms.camera * vsUniqueUniforms.model * vec4f(v.position, 1.0);
    return output;
}

@fragment
fn fragment() {

}