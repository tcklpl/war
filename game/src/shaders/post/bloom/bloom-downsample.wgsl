/*
    --------------------------------------------------------------------------------------------------
    Bloom Downsaple Shader

    TODO: explain
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

    var srcTexelSize = 1.0 / vec2f(textureDimensions(hdrBuffer));
    var x = srcTexelSize.x;
    var y = srcTexelSize.y;

    /*
        Take 13 samples around the current texel:

        a - b - c
        - j - k -
        d - e - f
        - l - m -
        g - h - i
    */
    var a = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x - 2.0 * x, v.uv.y + 2.0 * y)).rgb;
    var b = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x          , v.uv.y + 2.0 * y)).rgb;
    var c = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x + 2.0 * x, v.uv.y + 2.0 * y)).rgb;

    var d = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x - 2.0 * x, v.uv.y)).rgb;
    var e = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x          , v.uv.y)).rgb;
    var f = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x + 2.0 * x, v.uv.y)).rgb;

    var g = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x - 2.0 * x, v.uv.y - 2.0 * y)).rgb;
    var h = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x          , v.uv.y - 2.0 * y)).rgb;
    var i = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x + 2.0 * x, v.uv.y - 2.0 * y)).rgb;

    var j = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x - x, v.uv.y + y)).rgb;
    var k = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x + x, v.uv.y + y)).rgb;
    var l = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x - x, v.uv.y - y)).rgb;
    var m = textureSample(hdrBuffer, hdrSampler, vec2f(v.uv.x + x, v.uv.y - y)).rgb;

    var downsample = e * 0.125;
    downsample += (a + c + g + i) * 0.03125;
    downsample += (b + d + f + h) * 0.0625;
    downsample += (j + k + l + m) * 0.125;

    return vec4f(downsample, 1.0);
    
}