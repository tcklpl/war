/*
    --------------------------------------------------------------------------------------------------
    Principled BSDF Shader

    This Shader was based on the Learn OpenGL Tutorials and on the BSDF Implementation made by Google
    on the Filament engine.
    --------------------------------------------------------------------------------------------------
*/

// Outputs from the fragment shader
struct FSOutput {
    @location(0) hdr_color: vec4f,
    @location(1) normal: vec4f,
    @location(2) specular: vec2f
};

@fragment
fn fragment(v: VSOutput) -> FSOutput {

    /*
        Material Information:

        Texture Name    Format          Separation          Data Explanation
        -------------------------------------------------------------------------------
        Albedo          rgba16float     [r, g, b, a]¹       1: Material HDR color.

        Normal          rgba8unorm      [r, g, b]¹ [a]²     1: Normal vector;
                                                            2: AO.

        Props 1         rgba8unorm      [r]¹ [g]² [b]³ [a]⁴ 1: Metallic;
                                                            2: Roughness;
                                                            3: Transmission;
                                                            4: Transmission Roughness;

        Props 2         r16float        [r]¹                1: IOR

    */
    // albedo
    var albedoSample = textureSample(matAlbedo, matSampler, v.uv);
    var albedo = pow(albedoSample.rgb, vec3f(2.2));
    var alpha = albedoSample.a;

    // overlay
    var overlayColor = vsUniqueUniforms.overlay.rgb;
    var overlayIntensity = vsUniqueUniforms.overlay.a;
    albedo = mix(albedo, overlayColor, overlayIntensity);

    // normal and AO
    var normalAOSample = textureSample(matNormalAO, matSampler, v.uv);
    var normalMapVector = normalAOSample.xyz;
    var ao = normalAOSample.a;

    // props 1
    var props1Sample = textureSample(matProps1, matSampler, v.uv);
    var metallic = props1Sample.r;
    var roughness = props1Sample.g;
    var transmission = props1Sample.b;
    var transmissionRoughness = props1Sample.a;

    // props 2
    var props2Sample = textureSample(matProps2, matSampler, v.uv);
    var ior = props2Sample.r;

    // unused props, maybe use if in the future?
    var clearCoat = 0.0;
    var clearCoatPerceptualRoughness = 0.0;

    // getting parameters
    var normal = calculateNormal(v.uv, normalMapVector, v.model_normal, v.model_tangent, v.model_bitangent);
    var viewVector = normalize(vsCommonUniforms.camera_position - v.model_position.xyz);

    var cv = CommonVectors(
        normal,                                 // N
        viewVector,                             // V
        saturate(dot(normal, viewVector)),      // NoV
        reflect(-viewVector, normal),           // V_reflected_N
        v.model_normal                          // Geometry_N
    );

    var cp = CommonPositions(
        v.model_position.xyz                    // model position
    );

    var mat = MaterialInputs(
        albedo,
        metallic,
        roughness,
        ao,
        ior,
        clearCoat,
        clearCoatPerceptualRoughness
    );

    var pixel = getPixelParams(mat);
    pixel.uv = v.uv;

    var color = evaluateMaterial(mat, pixel, cv, cp);

    // reconstruct the normal matrix (transpose of inverse of model * view)
    var normalMatrix = mat3x3f(v.normal_matrix_0, v.normal_matrix_1, v.normal_matrix_2);
    // multiply the normal by the inverse of the model matrix to get the original vectors again
    // as all the lighting calculation is done in model-space
    var normalConversion = (vsUniqueUniforms.model_inverse * vec4f(normal, 0.0)).xyz;

    var kS = F_Schlick_Roughness(pixel.f0, pixel.roughness, cv.NoV).r;

    var output: FSOutput;
    output.hdr_color = color;
    output.normal = vec4f((normalMatrix * normalConversion) * 0.5 + 0.5, 1.0); // map normals from [-1, 1] to [0, 1] to save in a rgba8 texture
    output.specular = vec2f(kS, pixel.roughness); // specular and roughness to the environment shader

    return output;
}
