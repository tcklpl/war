/*
    --------------------------------------------------------------------------------------------------
    PTemporal Anti-Aliasing Shader

    TODO: Explain
    --------------------------------------------------------------------------------------------------
*/

const MODULATION_FACTOR = 0.9;

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

@group(0) @binding(0) var sampler_nearest: sampler;
@group(0) @binding(1) var sampler_linear: sampler;
@group(0) @binding(2) var current_frame: texture_2d<f32>;
@group(0) @binding(3) var previous_frame: texture_2d<f32>;


@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    var currentColor = textureSample(current_frame, sampler_nearest, v.uv);
    var previousColor = textureSample(previous_frame, sampler_linear, v.uv);
    
    var color = mix(currentColor, previousColor, MODULATION_FACTOR);

    return color;
}
