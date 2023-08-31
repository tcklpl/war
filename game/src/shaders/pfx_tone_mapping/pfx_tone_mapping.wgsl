/*
    --------------------------------------------------------------------------------------------------
    Post Effects and Tone Mapping Shader

    This shader applies post effects (TODO) and tonemaps the HDR buffer
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

@group(0) @binding(0) var pfx_sampler: sampler;
@group(0) @binding(1) var pfx_hdr: texture_2d<f32>;

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    var hdrColor = textureSample(pfx_hdr, pfx_sampler, v.uv).rgb;
    var gamma = 2.2;
    var exposure = 1.0; // TODO: pass exposure as uniform

    var mapped = vec3f(1.0) - exp(-hdrColor * exposure);
    mapped = pow(mapped, vec3f(1.0 / gamma));

    return vec4f(mapped, 1.0);
    
}
