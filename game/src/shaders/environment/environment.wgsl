/*
    --------------------------------------------------------------------------------------------------
    Environment Shader

    TODO: Explain
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

    var position = pos[vertexIndex];

    output.position = vec4f(position, 0.0, 1.0);
    output.uv = uv[vertexIndex];

    return output;
}


@group(0) @binding(0) var env_sampler: sampler;
@group(0) @binding(1) var depth_texture: texture_depth_2d;
@group(0) @binding(2) var normal_texture: texture_2d<f32>;
@group(0) @binding(3) var specular_texture: texture_2d<f32>;
@group(0) @binding(4) var ssao_texture: texture_2d<f32>;

// scene info
@group(1) @binding(1) var iblSampler: sampler;
@group(1) @binding(2) var iblIrradiance: texture_cube<f32>;
@group(1) @binding(3) var iblPrefiltered: texture_cube<f32>;
@group(1) @binding(4) var iblLUT: texture_2d<f32>;

struct EnviromentVariables {
    proj: mat4x4f,
    proj_inverse: mat4x4f
};
@group(2) @binding(0) var<uniform> env: EnviromentVariables;


fn VSPositionFromDepth(uv: vec2f) -> vec3f {
    // Get the depth value for this pixel
    var z = textureSample(depth_texture, env_sampler, uv);  
    // Get x/w and y/w from the viewport position
    var x = uv.x * 2.0 - 1.0;
    var y = (1.0 - uv.y) * 2.0 - 1.0;
    var vProjectedPos = vec4f(x, y, z, 1.0);
    // Transform by the inverse projection matrix
    var vPositionVS = env.proj_inverse * vProjectedPos;
    // Divide by w to get the view-space position
    return vPositionVS.xyz / vPositionVS.w;  
}

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    // get position and depth from map
    var fragPos = VSPositionFromDepth(v.uv);
    // get view vector from the position, as it is in view-space
    var V = normalize(-fragPos);

    // get normal from the texture
    var normalTexel = textureSample(normal_texture, env_sampler, v.uv);
    var normal = normalize(normalTexel.xyz * 2.0 - 1.0); // map normals from [0, 1] to [-1, 1] as they came from a rgba8 texture

    // get ambient occlusion
    var ao = textureSample(ssao_texture, env_sampler, v.uv).r;

    var V_reflected_N = reflect(-V, normal);
    var NoV = saturate(dot(normal, V));

    // get specular (kS) from the texture
    var specularTexel = textureSample(specular_texture, env_sampler, v.uv);
    var roughness = specularTexel.g;
    var kS = specularTexel.r;
    var kD = 1.0 - kS;

    // diffuse irradiance
    var irradiance = textureSample(iblIrradiance, iblSampler, normal).rgb;
    var diffuse = irradiance;

    // specular irradiance
    var MAX_REFLECTION_LOD = 4.0;
    var prefilteredColor = textureSampleLevel(iblPrefiltered, iblSampler, V_reflected_N, roughness * MAX_REFLECTION_LOD).rgb;
    var brdf = textureSample(iblLUT, iblSampler, vec2f(NoV, roughness)).rg;
    var specular = prefilteredColor * (kS * brdf.x + brdf.y);

    var ambient = (kD * diffuse + specular) * ao;

    // apply only on rendered geometry
    if (normalTexel.a == 0.0) {
        ambient = vec3f(0.0);
    }

    return vec4f(ambient, 1.0);
    
}
