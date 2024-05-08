/*
    --------------------------------------------------------------------------------------------------
    Shadow-related functions
    --------------------------------------------------------------------------------------------------
*/

fn evaluateShadowMappingFromAtlas(cv: CommonVectors, L: vec3f, model_pos: vec3f, uv_min: vec2f, uv_max: vec2f, view_proj: mat4x4f) -> f32 {
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
    var bias = max(0.05 * (1.0 - dot(cv.N, L)), 0.005);
    var biasModifier = 0.5;
    bias *= biasModifier;
    // bias *= 1.0 / (20.0 * biasModifier);

    // PCF
    var shadow = 0.0;
    var texelSize = 1.0 / vec2f(textureDimensions(sceneShadowAtlas));
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            var offset = vec2f(f32(x), f32(y)) * texelSize;
            var pcfDepth = textureSample(sceneShadowAtlas, sceneSampler, atlasUV.xy + offset);
            shadow += select(0.0, 1.0, (currentDepth - bias) > pcfDepth);
        }
    }
    shadow /= 9.0;

    // keep the shadow at 0.0 when outside the far_plane region of the light's frustum.
    // this cannot be done early because wgsl doesn't allow texture sampling in a non-uniform control flow.
    if (currentDepth < 0.0 || currentDepth > 1.0) {
        shadow = 0.0;
    }

    return shadow;
}
