/*
    --------------------------------------------------------------------------------------------------
    Punctual Light Handling and Manipulation
    --------------------------------------------------------------------------------------------------
*/

fn evaluatePunctualLights(pixel: PixelInfo, cv: CommonVectors, cp: CommonPositions) -> vec3f {

    var color = vec3f(0.0);
    for (var i = 0u; i < pointLights.count; i++) {

        var diff = cp.model_pos - pointLights.lights[i].position;
        var L = normalize(diff);
        var intensity = pointLights.lights[i].intensity;
        var distance = distance(cp.model_pos, pointLights.lights[i].position);
        var attenuation = 1.0 / (distance * distance);

        // Shadow mapping
        var visibility = 1.0;

        var light = Light(
            vec4f(pointLights.lights[i].color, intensity),  // color
            attenuation,                                    // attenuation
            L,                                              // light vector
            saturate(dot(cv.N, L))                          // NoL
        );
        
        color += surfaceShading(pixel, light, cv, visibility);
    }
    return color;
}
