/*
    --------------------------------------------------------------------------------------------------
    Post Effects and Tone Mapping Shader

    This shader applies post effects (TODO) and tonemaps the HDR buffer
    --------------------------------------------------------------------------------------------------
*/

override bloom_strength: f32;
override motion_blur_amount: f32;
override use_film_grain: bool;

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
@group(0) @binding(3) var pfx_velocity: texture_2d<f32>;
@group(0) @binding(4) var pfx_outline: texture_2d<f32>;

struct PFXOptions {
    // Selectors
    use_vignette: u32,
    use_chromatic_aberration: u32,

    // Options
    gamma: f32,
    avg_luminance: f32,
    vignette_strength: f32,
    vignette_size: f32,
    chromatic_aberration_amount: f32
};
@group(1) @binding(0) var<uniform> opt: PFXOptions;

const kSRGBLuminanceFactors = vec3f(0.2126, 0.7152, 0.0722);
fn srgbLuminance(color: vec3f) -> f32 {
    return saturate(dot(color, kSRGBLuminanceFactors));
}

fn reinhardExtended(v: vec3f, maxWhite: f32) -> vec3f {
    var numerator = v * (1.0 + (v / vec3f(maxWhite * maxWhite)));
    return numerator / (1.0 + v);
}

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    var hdrColor = textureSample(pfx_hdr, pfx_sampler, v.uv).rgb;
    var bloomColor = textureSample(pfx_bloom, pfx_sampler, v.uv).rgb;
    var velocityTexel = textureSample(pfx_velocity, pfx_sampler, v.uv).rg;
    var outlineTexel = textureSample(pfx_outline, pfx_sampler, v.uv).rgb;

    var texelSize = 1.0 / vec2f(textureDimensions(pfx_hdr));

    // Motion Blur
    if (motion_blur_amount > 0.0) {
        var velocity = velocityTexel * motion_blur_amount; // blur scale
        var samples = 5;
        var w = 1.0 / f32(samples);
        
        var accumulator = vec3f(0.0);
        for (var i = 0; i < samples; i++) {
            var t = f32(i) / f32(samples - 1);
            accumulator += textureSample(pfx_hdr, pfx_sampler, v.uv + (velocity * t)).rgb * w;
        }
        hdrColor = accumulator;
    }

    // Chromatic Aberration
    if (opt.use_chromatic_aberration == 1u) {
        hdrColor.r = textureSample(pfx_hdr, pfx_sampler, vec2f(v.uv.x + opt.chromatic_aberration_amount * texelSize.x, v.uv.y)).r;
        hdrColor.b = textureSample(pfx_hdr, pfx_sampler, vec2f(v.uv.x - opt.chromatic_aberration_amount * texelSize.x, v.uv.y)).b;
    }

    // Apply Bloom
    var mixedColor = mix(hdrColor, bloomColor, bloom_strength);

    // Tone Mapping
    var luminance = srgbLuminance(mixedColor);
    var whitePoint = 3.0;
    var lp = mixedColor / (9.6 * opt.avg_luminance + 0.0001);
    var mapped = reinhardExtended(lp, whitePoint);

    // var mapped = vec3f(1.0) - exp(-mixedColor * opt.exposure);
    mapped = pow(mapped, vec3f(1.0 / opt.gamma));

    // Film Grain
    if (use_film_grain) {
        var mdf = 0.03;
        var noise = fract(sin(dot(v.uv, vec2(12.9898,78.233) * 2.0)) * 43758.5453);
        mapped -= noise * mdf;
    }

    // Vignette
    if (opt.use_vignette == 1u) {
        var vignetteUV = v.uv; 
        vignetteUV *= 1.0 - v.uv.yx;
        var vignette = vignetteUV.x * vignetteUV.y * opt.vignette_size;
        vignette = saturate(pow(vignette, opt.vignette_strength));
        mapped *= vignette;
    }

    // Outline
    if (all(outlineTexel != vec3f(0.0, 0.0, 0.0))) {
        mapped = outlineTexel;
    }

    return vec4f(mapped, 1.0);
    
}
