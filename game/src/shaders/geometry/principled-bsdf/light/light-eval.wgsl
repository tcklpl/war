/*
    --------------------------------------------------------------------------------------------------
    Main Light Function
    --------------------------------------------------------------------------------------------------
*/

fn evaluateLights(mat: MaterialInputs, pixel: PixelInfo, cv: CommonVectors, cp: CommonPositions) -> vec4f {

    var color = vec3f(0.0);

    // IBL was delegated to the environment shader
    color += evaluateDirectionalLights(pixel, cv, cp);
    color += evaluatePunctualLights(pixel, cv, cp);
    // TODO: More punctual Lights (spot)

    return vec4f(color, 1.0);
}
