/*
    --------------------------------------------------------------------------------------------------
    Prepass Shader

    This shader outputs:
        - Depth map for early z testing;
        - Velocity map for motion blur; and
        - Outline mask texture;
    --------------------------------------------------------------------------------------------------
*/

@group(0) @binding(0) var<uniform> common_uniforms: VSCommonUniforms;
@group(1) @binding(0) var<uniform> unique_uniforms: VSUniqueUniforms;

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
    var worldPos = unique_uniforms.model * vec4f(position, 1.0);
    var viewPos  = common_uniforms.camera * worldPos;
    var pos = common_uniforms.projection * viewPos;

    var pos_jittered = pos + vec4f(common_uniforms.jitter, 0.0, 0.0) * pos.w;

    var prevWorldPos = unique_uniforms.previous_model * vec4f(position, 1.0);
    var prevViewPos  = common_uniforms.previous_camera * prevWorldPos;
    var prevPos = common_uniforms.previous_projection * prevViewPos;

    var output: VSOutput;
    output.position = pos_jittered;
    output.prev_position = prevPos;
    output.cur_position = pos;

    return output;
}

fn calculate_velocity(newPos: vec4f, oldPos: vec4f) -> vec2f {
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

fn get_outline_mask() -> u32 {
    return select(0u, unique_uniforms.id, (unique_uniforms.flags & FLAG_OUTLINE) != 0);
}

struct FSOutput {
    @location(0) velocity_texture: vec2f,
    @location(1) outline_mask: u32,
}

@fragment
fn fragment(v: VSOutput) -> FSOutput {
    let velocity = calculate_velocity(v.cur_position, v.prev_position);
    let outline_mask = get_outline_mask();

    var output: FSOutput;
    output.velocity_texture = velocity;
    output.outline_mask = outline_mask;
    return output;
}