/*
    --------------------------------------------------------------------------------------------------
    Cubemap Prefiltering Shader

    This shader prefilters a cubemap using different roughness levels. This is used for the IBL 
    specular color.
    --------------------------------------------------------------------------------------------------
*/

const PI = 3.14159265359;
const SAMPLE_COUNT = 1024u;

/*
    Vertex uniforms what are common to every entity on the scane (on the same frame)
*/
struct VSCommonUniforms {
    camera: mat4x4f,
    projection: mat4x4f
};
@group(0) @binding(0) var<uniform> vsCommonUniforms: VSCommonUniforms;

/*
    Values sent from the vertex shader to the fragment shader
*/
struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) localPos: vec3f
};

@vertex
fn vertex(@builtin(vertex_index) vertexIndex : u32) -> VSOutput {
    var output: VSOutput;

    var vertPositions = array(
        vec3f(1.0, -1.0, 1.0),
        vec3f(-1.0, -1.0, 1.0),
        vec3f(-1.0, -1.0, -1.0),
        vec3f(1.0, -1.0, -1.0),
        vec3f(1.0, -1.0, 1.0),
        vec3f(-1.0, -1.0, -1.0),

        vec3f(1.0, 1.0, 1.0),
        vec3f(1.0, -1.0, 1.0),
        vec3f(1.0, -1.0, -1.0),
        vec3f(1.0, 1.0, -1.0),
        vec3f(1.0, 1.0, 1.0),
        vec3f(1.0, -1.0, -1.0),

        vec3f(-1.0, 1.0, 1.0),
        vec3f(1.0, 1.0, 1.0),
        vec3f(1.0, 1.0, -1.0),
        vec3f(-1.0, 1.0, -1.0),
        vec3f(-1.0, 1.0, 1.0),
        vec3f(1.0, 1.0, -1.0),

        vec3f(-1.0, -1.0, 1.0),
        vec3f(-1.0, 1.0, 1.0),
        vec3f(-1.0, 1.0, -1.0),
        vec3f(-1.0, -1.0, -1.0),
        vec3f(-1.0, -1.0, 1.0),
        vec3f(-1.0, 1.0, -1.0),

        vec3f(1.0, 1.0, 1.0),
        vec3f(-1.0, 1.0, 1.0),
        vec3f(-1.0, -1.0, 1.0),
        vec3f(-1.0, -1.0, 1.0),
        vec3f(1.0, -1.0, 1.0),
        vec3f(1.0, 1.0, 1.0),

        vec3f(1.0, -1.0, -1.0),
        vec3f(-1.0, -1.0, -1.0),
        vec3f(-1.0, 1.0, -1.0),
        vec3f(1.0, 1.0, -1.0),
        vec3f(1.0, -1.0, -1.0),
        vec3f(-1.0, 1.0, -1.0)
    );

    let pos = vertPositions[vertexIndex];

    output.position = vsCommonUniforms.projection * vsCommonUniforms.camera * vec4f(pos, 0.0);
    output.position = output.position.xyww; // make sure all the skybox fragments end up with max depth
    output.localPos = 0.5 * (pos + vec3f(1.0, 1.0, 1.0));

    return output;
}

@group(1) @binding(0) var mapSampler: sampler;
@group(1) @binding(1) var mapTexture: texture_cube<f32>;
struct PrefilterOptions {
    roughness: f32,
    cubemapResolution: f32
};
@group(1) @binding(2) var<uniform> options: PrefilterOptions;

fn D_GGX(N: vec3f, H: vec3f, roughness: f32) -> f32 {

    var a = roughness * roughness;
    var a2 = a * a;
    var NoH = max(dot(N, H), 0.0);
    var NoH2 = NoH * NoH;

    var nom = a2;
    var denom = (NoH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / denom;
}

fn radicalInverse_VdC(abits: u32) -> f32 {
    var bits = abits;
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return f32(bits) * 2.3283064365386963e-10;
}

fn Hammersley(i: u32, N: u32) -> vec2f {
    return vec2f(f32(i) / f32(N), radicalInverse_VdC(i));
}

fn importanceSampleGGX(Xi: vec2f, N: vec3f, roughness: f32) -> vec3f {

    var a = roughness * roughness;

    var phi = 2.0 * PI * Xi.x;
    var cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));
    var sinTheta = sqrt(1.0 - cosTheta * cosTheta);

    // from spherical coordinates to cartesian coordinates - halfway vector
    var H = vec3f(
        cos(phi) * sinTheta,
        sin(phi) * sinTheta,
        cosTheta
    );

    // from tangent-space H vector to world-space sample vector
    var up = vec3f(1.0, 0.0, 0.0);
    if (abs(N.z) < 0.999) {
        up = vec3f(0.0, 0.0, 1.0);
    }
    var tangent = normalize(cross(up, N));
    var bitangent = cross(N, tangent);

    var sampleVec = tangent * H.x + bitangent * H.y + N * H.z;
    return normalize(sampleVec);
}

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    var N = normalize(v.localPos.xyz - vec3f(0.5));

    // make the simplifying assumption that V and R equals the normal 
    var R = N;
    var V = R;

    var prefilteredColor = vec3f(0.0);
    var totalWeight = 0.0;

    for (var i = 0u; i < SAMPLE_COUNT; i++) {

        // generates a sample vector that's biased towards the preferred alignment direction (importance sampling).
        var Xi = Hammersley(i, SAMPLE_COUNT);
        var H = importanceSampleGGX(Xi, N, options.roughness);
        var L = normalize(2.0 * dot(V, H) * H - V);

        var NoL = max(dot(N, L), 0.0);
        if (NoL > 0.0) {

            // sample from the environment's mip level based on roughness/pdf
            var D = D_GGX(N, H, options.roughness);
            var NoH = max(dot(N, H), 0.0);
            var HoV = max(dot(H, V), 0.0);
            var pdf = D * NoH / (4.0 * HoV) + 0.0001;

            var resolution = options.cubemapResolution;
            var saTexel = 4.0 * PI / (6.0 * resolution * resolution);
            var saSample = 1.0 / (f32(SAMPLE_COUNT) * pdf + 0.0001);

            var mipLevel = 0.0;
            if (options.roughness != 0.0) {
                mipLevel = 0.5 * log2(saSample / saTexel);
            }

            prefilteredColor += textureSampleLevel(mapTexture, mapSampler, L, mipLevel).rgb * NoL;
            totalWeight += NoL;
        }

    }

    prefilteredColor = prefilteredColor / totalWeight;
    
    return vec4f(prefilteredColor, 1.0);
    
}