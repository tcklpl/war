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
@group(0) @binding(4) var velocity_buffer: texture_2d<f32>;


@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    var velocitySamplePos = v.uv;
    var velocity = textureSample(velocity_buffer, sampler_nearest, velocitySamplePos).xy;
    var previousPixelPos = v.uv - velocity;

    var currentColor = textureSample(current_frame, sampler_nearest, v.uv);
    var previousColor = textureSample(previous_frame, sampler_linear, previousPixelPos);

    // apply champing on the previous color to prevent ghosting
    var texelSize = 1.0 / vec2f(textureDimensions(current_frame));
    var nearColor0 = textureSample(current_frame, sampler_nearest, v.uv + (texelSize * vec2f( 1.0, 0.0)));
    var nearColor1 = textureSample(current_frame, sampler_nearest, v.uv + (texelSize * vec2f( 0.0, 1.0)));
    var nearColor2 = textureSample(current_frame, sampler_nearest, v.uv + (texelSize * vec2f(-1.0, 0.0)));
    var nearColor3 = textureSample(current_frame, sampler_nearest, v.uv + (texelSize * vec2f( 0.0,-1.0)));

    var boxMin = min(currentColor, min(nearColor0, min(nearColor1, min(nearColor2, nearColor3))));
    var boxMax = max(currentColor, max(nearColor0, max(nearColor1, max(nearColor2, nearColor3))));

    previousColor = clamp(previousColor, boxMin, boxMax);

    
    var color = mix(currentColor, previousColor, MODULATION_FACTOR);

    return color;
}
