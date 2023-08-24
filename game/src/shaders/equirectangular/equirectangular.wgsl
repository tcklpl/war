/*
    --------------------------------------------------------------------------------------------------
    Equirectangular Shader

    This shader is used to render equirectangular HDR images to 6 different textures to use them as
    cubemaps.
    --------------------------------------------------------------------------------------------------
*/

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

    output.position = vsCommonUniforms.projection * vsCommonUniforms.camera * vec4f(pos, 1.0);
    output.localPos = pos;

    return output;
}

@group(1) @binding(0) var mapSampler: sampler;
@group(1) @binding(1) var mapTexture: texture_2d<f32>;


const invAtan = vec2f(0.1591, 0.3183);
fn SampleSphericalMap(v: vec3f) -> vec2f {
    var uv = vec2f(atan2(v.z, v.x), asin(v.y));
    uv *= invAtan;
    uv += 0.5;
    return uv;
}

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    var uv = SampleSphericalMap(normalize(v.localPos.xyz)); // make sure to normalize localPos
    var color = textureSample(mapTexture, mapSampler, uv).rgb;
    color = pow(color, vec3f(2.2));
    
    return vec4f(color, 1.0);
    
}