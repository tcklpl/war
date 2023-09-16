/*
    --------------------------------------------------------------------------------------------------
    Post Effects and Tone Mapping Shader

    This shader applies post effects (TODO) and tonemaps the HDR buffer
    --------------------------------------------------------------------------------------------------
*/

const BLOOM_STRENGTH = 0.04;

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
@group(0) @binding(2) var pfx_bloom: texture_2d<f32>;

struct PFXOptions {
    // Selectors
    use_vignette: u32,
    use_chromatic_aberration: u32,

    // Options
    gamma: f32,
    exposure: f32,
    vignette_strength: f32,
    vignette_size: f32,
    chromatic_aberration_amount: f32
};
@group(1) @binding(0) var<uniform> opt: PFXOptions;

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    var hdrColor = textureSample(pfx_hdr, pfx_sampler, v.uv).rgb;
    var bloomColor = textureSample(pfx_bloom, pfx_sampler, v.uv).rgb;

    var texelSize = 1.0 / vec2f(textureDimensions(pfx_hdr));

    // Chromatic Aberration
    if (opt.use_chromatic_aberration == 1u) {
        hdrColor.r = textureSample(pfx_hdr, pfx_sampler, vec2f(v.uv.x + opt.chromatic_aberration_amount * texelSize.x, v.uv.y)).r;
        hdrColor.b = textureSample(pfx_hdr, pfx_sampler, vec2f(v.uv.x - opt.chromatic_aberration_amount * texelSize.x, v.uv.y)).b;
    }

    // Apply Bloom
    var mixedColor = mix(hdrColor, bloomColor, BLOOM_STRENGTH);

    // Tone Mapping
    var mapped = vec3f(1.0) - exp(-mixedColor * opt.exposure);
    mapped = pow(mapped, vec3f(1.0 / opt.gamma));

    // Vignette
    if (opt.use_vignette == 1u) {
        var vignetteUV = v.uv; 
        vignetteUV *= 1.0 - v.uv.yx;
        var vignette = vignetteUV.x * vignetteUV.y * opt.vignette_size;
        vignette = saturate(pow(vignette, opt.vignette_strength));
        mapped *= vignette;
    }

    return vec4f(mapped, 1.0);
    
}
