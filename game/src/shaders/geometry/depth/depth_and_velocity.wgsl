/*
    --------------------------------------------------------------------------------------------------
    Depth and Velocity Shader

    This shader outputs only the depth of each fragment. Useful for early z-mapping and shadow mapping
    --------------------------------------------------------------------------------------------------
*/

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
    jitter: vec2f,
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

struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) prev_position: vec4f,
    @location(1) cur_position: vec4f
};

@vertex
fn vertex(@location(0) position: vec3f) -> VSOutput {
    // It's important to calculate worldPos and the final position separately because the other shaders also do this
    // and precision issues start to occur if the calculation is different (even though the final result SHOULD be the same)
    // https://stackoverflow.com/questions/46914862/z-fighting-after-depth-prepass-on-gtx-980
    var worldPos = vsUniqueUniforms.model * vec4f(position, 1.0);
    var viewPos  = vsCommonUniforms.camera * worldPos;
    var pos = vsCommonUniforms.projection * viewPos;

    var pos_jittered = pos + vec4f(vsCommonUniforms.jitter, 0.0, 0.0) * pos.w;

    var prevWorldPos = vsUniqueUniforms.previous_model * vec4f(position, 1.0);
    var prevViewPos  = vsCommonUniforms.previous_camera * prevWorldPos;
    var prevPos = vsCommonUniforms.previous_projection * prevViewPos;

    var output: VSOutput;
    output.position = pos_jittered;
    output.prev_position = prevPos;
    output.cur_position = pos;

    return output;
}

fn calculateVelocity(newPos: vec4f, oldPos: vec4f) -> vec2f {
    var oldP = oldPos;
    oldP /= oldP.w;
    oldP = (oldP + 1.0) / 2.0;
    oldP.y = 1.0 - oldP.y;

    var newP = newPos;
    newP /= newP.w;
    newP = (newP + 1.0) / 2.0;
    newP.y = 1.0 - newP.y;

    return (newP - oldP).xy;
}

@fragment
fn fragment(v: VSOutput) -> @location(0) vec2f {
    var velocity = calculateVelocity(v.cur_position, v.prev_position);
    return velocity;
}