@group(0) @binding(0) var<uniform> common_uniforms: VSCommonUniforms;
@group(1) @binding(0) var<uniform> unique_uniforms: VSUniqueUniforms;

struct VSOutput {
    @builtin(position) position: vec4f,
};

@vertex
fn vertex(@location(0) position: vec3f) -> VSOutput {
    // It's important to calculate worldPos and the final position separately because the other shaders also do this
    // and precision issues start to occur if the calculation is different (even though the final result SHOULD be the same)
    // https://stackoverflow.com/questions/46914862/z-fighting-after-depth-prepass-on-gtx-980
    var worldPos = unique_uniforms.model * vec4f(position, 1.0);
    var viewPos  = common_uniforms.camera * worldPos;
    var pos = common_uniforms.projection * viewPos;

    var output: VSOutput;
    output.position = pos;
    return output;
}

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {
    return unique_uniforms.outline_color;
}