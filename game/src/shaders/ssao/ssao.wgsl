/*
    --------------------------------------------------------------------------------------------------
    SSAO Shader

    TODO: Explain
    --------------------------------------------------------------------------------------------------
*/

const MAX_KERNEL_SIZE = 64;

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

@group(0) @binding(0) var noise_sampler: sampler;
@group(0) @binding(1) var depth_sampler: sampler;

@group(0) @binding(2) var noise_texture: texture_2d<f32>;
@group(0) @binding(3) var pos_texture: texture_2d<f32>;
@group(0) @binding(4) var normal_texture: texture_2d<f32>;

struct SSAOOptions {
    proj: mat4x4f,
    bias: f32
};
@group(1) @binding(0) var<uniform> opt: SSAOOptions;

struct Kernel {
    size: u32,
    radius: f32,
    samples: array<vec3f, MAX_KERNEL_SIZE>,
};
@group(1) @binding(1) var<uniform> kernel: Kernel;

@fragment
fn fragment(v: VSOutput) -> @location(0) f32 {

    // get position and depth from map
    var pos = textureSample(pos_texture, depth_sampler, v.uv);
    var fragPos = pos.xyz;

    // get normal from the texture
    var normal = textureSample(normal_texture, depth_sampler, v.uv).xyz;
    normal = normalize(normal * 2.0 - 1.0); // map normals from [0, 1] to [-1, 1] as they came from a rgba8 texture

    // get random vector from the texture
    var screenSize = vec2f(textureDimensions(pos_texture));
    var noiseScale = screenSize / 4.0;
    var noiseVec = vec3f(textureSample(noise_texture, noise_sampler, v.uv * noiseScale).xy, 0.0);

    // build TBN matrix
    var tangent = normalize(noiseVec - normal * dot(noiseVec, normal));
    var bitangent = normalize(cross(normal, tangent));
    var tbn = mat3x3(tangent, bitangent, normal);

    var occlusion = 0.0;
    for (var i = 0u; i < kernel.size; i++) {

        // get sample position
        var samplePos = tbn * kernel.samples[i]; // from tangent to view space
        samplePos = fragPos + samplePos * kernel.radius;

        var offset = vec4f(samplePos, 0.0);
        offset = opt.proj * offset;         // view to clip space
        offset /= offset.w;               // perspective divide
        offset = offset * 0.5 + 0.5;    // transform to range 0.0 - 1.0
        
        var sampleDepth = textureSample(pos_texture, depth_sampler, vec2f(offset.x, 1.0 - offset.y)).z;
        var rangeCheck = smoothstep(0.0, 1.0, kernel.radius / abs(fragPos.z - sampleDepth));

        if (sampleDepth >= (samplePos.z + opt.bias)) {
            occlusion += rangeCheck; // this would be 1.0 * rangeCheck
        }
    }

    occlusion = 1.0 - (occlusion / f32(kernel.size));
    return occlusion;
    
}
