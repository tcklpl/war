/*
    --------------------------------------------------------------------------------------------------
    Depth Shader

    This shader outputs only the depth of each fragment. Useful for early z-mapping and shadow mapping
    --------------------------------------------------------------------------------------------------
*/

/*
    Vertex uniforms what are common to every entity on the scane (on the same frame)
*/
struct VSCommonUniforms {
    camera: mat4x4f,
    camera_inverse: mat4x4f,
    projection: mat4x4f,
    camera_position: vec3f
};
@group(0) @binding(0) var<uniform> vsCommonUniforms: VSCommonUniforms;

/*
    Vertex uniforms that are unique to each entity
*/
struct VSUniqueUniforms {
    model: mat4x4f,
    model_inverse: mat4x4f,
    id: u32
};
@group(1) @binding(0) var<uniform> vsUniqueUniforms: VSUniqueUniforms;

@vertex
fn vertex(@location(0) position: vec3f) -> @builtin(position) vec4f {
    // It's important to calculate worldPos and the final position separately because the other shaders also do this
    // and precision issues start to occur if the calculation is different (even though the final result SHOULD be the same)
    // https://stackoverflow.com/questions/46914862/z-fighting-after-depth-prepass-on-gtx-980
    var worldPos = vsUniqueUniforms.model * vec4f(position, 1.0);
    var viewPos  = vsCommonUniforms.camera * worldPos;
    var pos = vsCommonUniforms.projection * viewPos;
    return pos;
}

@fragment
fn fragment() {
}