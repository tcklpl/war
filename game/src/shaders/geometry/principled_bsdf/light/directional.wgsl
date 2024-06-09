/*
    --------------------------------------------------------------------------------------------------
    Directional Light Handling and Manipulation
    --------------------------------------------------------------------------------------------------
*/


fn directionalLightAsDiscAreaLight(cv: CommonVectors, direction: vec3f) -> vec3f {
    var LoR = dot(direction, cv.V_reflected_N);
    var d = direction.x;
    var s = cv.V_reflected_N - LoR * direction;
    return normalize(direction * d + normalize(s) * direction.y);
    // if (LoR < d) {
    //     return normalize(direction * d + normalize(s) * direction.y);
    // } else {
    //     return cv.V_reflected_N;
    // }
}

fn evaluateDirectionalLights(pixel: PixelInfo, cv: CommonVectors, cp: CommonPositions) -> vec3f {

    var color = vec3f(0.0);
    for (var i = 0u; i < directionalLights.count; i++) {

        var L = normalize(-directionalLights.lights[i].direction);
        var intensity = log2(directionalLights.lights[i].intensity); // idk

        // Shadow mapping
        var visibility = 1.0;
        // if the shadow map is not present all values in the vec4f will be -1.0.
        // I'll only check the first one because no valid UV would be < 0
        if (directionalLights.lights[i].uv.x != -1.0) {
            var shadow = evaluateShadowMappingFromAtlas(
                cv,
                L,
                cp.model_pos,
                directionalLights.lights[i].uv.xy,
                directionalLights.lights[i].uv.zw,
                directionalLights.lights[i].view_proj
            );
            visibility = 1.0 - shadow;
        }

        // TODO: actually load light intensity
        var light = Light(
            vec4f(directionalLights.lights[i].color, intensity),  // color
            1.0,                                            // attenuation
            L,                                              // light vector
            saturate(dot(cv.N, L))                          // NoL
        );

        color += surfaceShading(pixel, light, cv, visibility);
    }

    return color;
}
