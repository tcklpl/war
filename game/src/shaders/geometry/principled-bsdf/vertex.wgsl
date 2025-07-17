/*
    Vertex shader input from the 3d models
*/
struct VSInput {
    @location(0) position: vec3f,
    @location(1) uv: vec2f,
    @location(2) normal: vec3f,
    @location(3) tangent: vec4f
};

/*
    Values sent from the vertex shader to the fragment shader
*/
struct VSOutput {
    // NDC Vertex position and UV
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,

    // Position, normal, tangent and bitangent in model-space
    @location(1) model_position: vec3f,
    @location(2) model_normal: vec3f,
    @location(3) model_tangent: vec3f,
    @location(4) model_bitangent: vec3f,

    // Position in view-space. TEMPORARY, this position will be infered from the depth buffer
    @location(5) view_position: vec3f,

    // Matrix to transform normals into view-space. Used to write the normals to the normal buffer
    // in order to calculate SSAO and SSR later.
    @location(6) @interpolate(flat) normal_matrix_0: vec3f,
    @location(7) @interpolate(flat) normal_matrix_1: vec3f,
    @location(8) @interpolate(flat) normal_matrix_2: vec3f,
};

fn multiplyNTBModel(v: vec3f) -> vec3f {
    return normalize((vsUniqueUniforms.model * vec4f(v, 0.0)).xyz);
}

@vertex
fn vertex(v: VSInput) -> VSOutput {
    var output: VSOutput;

    output.uv = v.uv;
    var worldPos = vsUniqueUniforms.model * vec4f(v.position, 1.0);
    var viewPos  = vsCommonUniforms.camera * worldPos;
    var pos      = vsCommonUniforms.projection * viewPos;

    pos += vec4f(vsCommonUniforms.jitter, 0.0, 0.0) * pos.w;

    output.model_position = vec3f(worldPos.xyz);
    output.view_position = viewPos.xyz;
    output.position = pos;

    var N = multiplyNTBModel(v.normal);
    var T = multiplyNTBModel(v.tangent.xyz);
    T = normalize(T - dot(T, N) * N);
    var B = cross(N, T);

    output.model_normal = N;
    output.model_tangent = T;
    output.model_bitangent = B;

    /* 
        Matrix to convert normals to view-space. Used to calculate SSAO and SSR later on.
        The original calculation was:

            transpose(invert(view * model))

        But, as wgsl doesn't have any invert function, I changed it to:

            transpose(model_inverse * view_inverse)

        Which is mathematically equivalent plus we don't need to invert matrices on the shader. 
    */
    var normalMatrix = transpose(vsUniqueUniforms.model_inverse * vsCommonUniforms.camera_inverse);
    // we split the matrix into 3 vec3f as for some reason I cannot pass a mat4x4f as a varying
    output.normal_matrix_0 = normalMatrix[0].xyz;
    output.normal_matrix_1 = normalMatrix[1].xyz;
    output.normal_matrix_2 = normalMatrix[2].xyz;

    return output;
}
