/*
    --------------------------------------------------------------------------------------------------
    BRDF Colvolution Integral shader

    This shader integrates part of the BRDF integral and stores it in a rg16f texture.
    --------------------------------------------------------------------------------------------------
*/

const PI = 3.14159265359;
const SAMPLE_COUNT = 1024u;

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

fn D_GGX(NoV: f32, roughness: f32) -> f32 {

    var a = roughness;
    var k = (a * a) / 2.0;

    var nom = NoV;
    var denom = NoV * (1.0 - k) + k;

    return nom / denom;
}

fn G_Smith(N: vec3f, V: vec3f, L: vec3f, roughness: f32) -> f32 {

    var NoV = max(dot(N, V), 0.0);
    var NoL = max(dot(N, L), 0.0);
    var ggx2 = D_GGX(NoV, roughness);
    var ggx1 = D_GGX(NoL, roughness);

    return ggx1 * ggx2;
}

fn integrateBRDF(NoV: f32, roughness: f32) -> vec2f {

    var V = vec3f(
        sqrt(1.0 - NoV * NoV),
        0.0,
        NoV
    );

    var a = 0.0;
    var b = 0.0;

    var N = vec3f(0.0, 0.0, 1.0);

    for (var i = 0u; i < SAMPLE_COUNT; i++) {
        
        // generates a sample vector that's biased towards the
        // preferred alignment direction (importance sampling).
        var Xi = Hammersley(i, SAMPLE_COUNT);
        var H = importanceSampleGGX(Xi, N, roughness);
        var L = normalize(2.0 * dot(V, H) * H - V);

        var NoL = max(L.z, 0.0);
        var NoH = max(H.z, 0.0);
        var VoH = max(dot(V, H), 0.0);

        if (NoL > 0.0) {

            var G = G_Smith(N, V, L, roughness);
            var G_Vis = (G * VoH) / (NoH * NoV);
            var Fc = pow(1.0 - VoH, 5.0);

            a += (1.0 - Fc) * G_Vis;
            b += Fc * G_Vis;
        }
    }

    a /= f32(SAMPLE_COUNT);
    b /= f32(SAMPLE_COUNT);

    return vec2f(a, b);
}

@fragment
fn fragment(v: VSOutput) -> @location(0) vec2f {

    var integrated = integrateBRDF(v.uv.x, v.uv.y);
    return integrated;
    
}