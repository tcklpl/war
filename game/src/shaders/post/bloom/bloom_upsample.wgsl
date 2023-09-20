/*
    --------------------------------------------------------------------------------------------------
    Bloom Upsample Shader

    TODO: explain
    --------------------------------------------------------------------------------------------------
*/

const FILTER_RADIUS = 0.004; // this COULD be an uniform

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
        vec2f( 1.0,  1.0),
        vec2f( 1.0, -1.0),
        vec2f(-1.0, -1.0),
        vec2f( 1.0,  1.0),
        vec2f(-1.0, -1.0),
        vec2f(-1.0,  1.0)
    );

    var uv = array(
        vec2f(1.0, 0.0),
        vec2f(1.0, 1.0),
        vec2f(0.0, 1.0),
        vec2f(1.0, 0.0),
        vec2f(0.0, 1.0),
        vec2f(0.0, 0.0)
    );

    output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
    output.uv = uv[vertexIndex];

    return output;
}

@group(0) @binding(0) var hdrSampler: sampler;
@group(0) @binding(1) var hdrBuffer: texture_2d<f32>;

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    var x = FILTER_RADIUS;
    var y = FILTER_RADIUS;

    /*
        Take 9 samples around the current texel:
        a - b - c
        d - e - f
        g - h - i
    */
    var a = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x - x, v.uv.y + y)).rgb;
    var b = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x    , v.uv.y + y)).rgb;
    var c = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x + x, v.uv.y + y)).rgb;

    var d = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x - x, v.uv.y)).rgb;
    var e = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x    , v.uv.y)).rgb;
    var f = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x + x, v.uv.y)).rgb;

    var g = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x - x, v.uv.y - y)).rgb;
    var h = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x    , v.uv.y - y)).rgb;
    var i = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x + x, v.uv.y - y)).rgb;

    /*
        Apply weighted distribution, by using a 3x3 tent filter:
        1    |1 2 1|
        -- * |2 4 2|
        16   |1 2 1|
    */
    var upsample = e * 4.0;
    upsample += (b + d + f + h) * 2.0;
    upsample += (a + c + g + i);
    upsample *= 1.0 / 16.0;

    return vec4f(upsample, 1.0);
    
}