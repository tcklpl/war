/*
    --------------------------------------------------------------------------------------------------
    2D Vec3 + f32 Texture Packer
    --------------------------------------------------------------------------------------------------
*/

/*
    Values sent from the vertex shader to the fragment shader
*/
struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f
};

@vertex
fn vertex(@builtin(vertex_index) vertexIndex : u32) -> VSOutput {
    var output: VSOutput;

    var pos = array(
        vec2( 1.0,  1.0),
        vec2( 1.0, -1.0),
        vec2(-1.0, -1.0),
        vec2( 1.0,  1.0),
        vec2(-1.0, -1.0),
        vec2(-1.0,  1.0)
    );

    var uv = array(
        vec2(1.0, 0.0),
        vec2(1.0, 1.0),
        vec2(0.0, 1.0),
        vec2(1.0, 0.0),
        vec2(0.0, 1.0),
        vec2(0.0, 0.0)
    );

    output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
    output.uv = uv[vertexIndex];

    return output;
}

@group(0) @binding(0) var packSampler: sampler;
@group(0) @binding(1) var packRGB: texture_2d<f32>;
@group(0) @binding(2) var packA: texture_2d<f32>;

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {
    var rgb = textureSample(packRGB, packSampler, v.uv).rgb;
    var a = textureSample(packA, packSampler, v.uv).r;
    return vec4f(rgb, a);
}