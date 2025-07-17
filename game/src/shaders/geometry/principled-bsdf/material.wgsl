/*
    --------------------------------------------------------------------------------------------------
    Main Material Function
    --------------------------------------------------------------------------------------------------
*/

fn evaluateMaterial(mat: MaterialInputs, pixel: PixelInfo, cv: CommonVectors, cp: CommonPositions) -> vec4f {
    return evaluateLights(mat, pixel, cv, cp);
}
