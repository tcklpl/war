/*
    --------------------------------------------------------------------------------------------------
    Cubemap Convolution Shader

    This shader is used to convolute cubemaps for IBL.
    --------------------------------------------------------------------------------------------------
*/

const PI = 3.14159265359;

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
    output.localPos = 0.5 * (pos + vec3f(1.0, 1.0, 1.0));

    return output;
}

@group(1) @binding(0) var mapSampler: sampler;
@group(1) @binding(1) var mapTexture: texture_cube<f32>;


const invAtan = vec2f(0.1591, 0.3183);
fn SampleSphericalMap(v: vec3f) -> vec2f {
    var uv = vec2f(atan2(v.z, v.x), asin(v.y));
    uv *= invAtan;
    uv += 0.5;
    return uv;
}

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {

    // the sample direction equals the hemisphere's orientation 
    var normal = normalize(v.localPos - vec3f(0.5));
    var irradiance = vec3f(0.0);
  
    var up    = vec3(0.0, 1.0, 0.0);
    var right = normalize(cross(up, normal));
    up        = normalize(cross(normal, right));

    var sampleDelta = 0.025;
    var nrSamples = 0.0;

    for(var phi = 0.0; phi < 2.0 * PI; phi += sampleDelta) {
        for(var theta = 0.0; theta < 0.5 * PI; theta += sampleDelta) {
            // spherical to cartesian (in tangent space)
            var tangentSample = vec3(sin(theta) * cos(phi),  sin(theta) * sin(phi), cos(theta));
            // tangent space to world
            var sampleVec = tangentSample.x * right + tangentSample.y * up + tangentSample.z * normal; 

            irradiance += textureSample(mapTexture, mapSampler, sampleVec).rgb * cos(theta) * sin(theta);
            nrSamples += 1.0;
        }
    }
    irradiance = PI * irradiance * (1.0 / nrSamples);
  
    return vec4f(irradiance, 1.0);
}