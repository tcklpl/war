struct VSCommonUniforms {
    camera: mat4x4f,
    projection: mat4x4f
};
@group(0) @binding(0) var<uniform> vsCommonUniforms: VSCommonUniforms;

struct VSUniqueUniforms {
    model: mat4x4f
};
@group(1) @binding(0) var<uniform> vsUniqueUniforms: VSUniqueUniforms;

struct VSInput {
    @location(0) position: vec3f,
    @location(1) uv: vec2f,
    @location(2) normal: vec3f,
    @location(3) tangent: vec4f
};

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
fn fragment(v: VSOutput) -> @location(0) vec4f {
    return vec4f(1.0);
}