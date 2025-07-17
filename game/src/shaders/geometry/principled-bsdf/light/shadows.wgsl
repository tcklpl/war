/*
    --------------------------------------------------------------------------------------------------
    Shadow-related functions
    --------------------------------------------------------------------------------------------------
*/

fn evaluateShadowMappingFromAtlas(
    pixel: PixelInfo, 
    cv: CommonVectors, 
    L: vec3f, 
    light_radius: f32,
    model_pos: vec3f, 
    uv_min: vec2f, 
    uv_max: vec2f, 
    view_proj: mat4x4f
) -> f32 {
    // get light projection from model position
    var fragPosLightSpace = view_proj * vec4f(model_pos, 1.0);
    // perspective divide
    var projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    // transform to [0, 1] range
    var projUV = projCoords.xyz * 0.5 + 0.5;
    projUV.y = 1.0 - projUV.y;
    // remap to shadow atlas region
    var uvDiff = uv_max - uv_min;
    var uvOffset = projUV.xy * uvDiff;
    var atlasUV = uv_min + uvOffset;

    // depth of the current fragment from light's perspective
    var currentDepth = projCoords.z;

    // calculate bias (based on slope)
    var bias = max(0.05 * (1.0 - abs(dot(cv.N, L))), 0.005);
    var biasModifier = 0.5;
    bias *= biasModifier;
    // bias *= 1.0 / (20.0 * biasModifier);

    var texelSize = 1.0 / vec2f(textureDimensions(sceneShadowAtlas));

    var shadowParams = ShadowCalcParams(
        currentDepth,   // light_projected_depth
        light_radius,   // light_radius
        bias,           // bias
        atlasUV,        // atlas_uv
        uv_min,         // atlas_uv_region_min
        uv_max,         // atlas_uv_region_max
        texelSize,      // texel_size
        pixel.uv        // global_uv
    );

    // PCF
    var shadow = 0.0;
    shadow = shadowFiltering(shadowParams);

    // keep the shadow at 0.0 when outside the far_plane region of the light's frustum.
    // this cannot be done early because wgsl doesn't allow texture sampling in a non-uniform control flow.
    if (currentDepth < 0.0 || currentDepth > 1.0) {
        shadow = 0.0;
    }

    return shadow;
}
