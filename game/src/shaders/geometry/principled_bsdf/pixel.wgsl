/*
    --------------------------------------------------------------------------------------------------
    Pixel Params and Remapping
    --------------------------------------------------------------------------------------------------
*/

fn getMaterialParams(mat: MaterialInputs, pixel: ptr<function, PixelInfo>) {

    (*pixel).diffuse = (1.0 - mat.metallic) * mat.albedo.rgb;
    (*pixel).f0 = vec3f(IORtoF0(mat.ior));
    (*pixel).roughness = mat.roughness * mat.roughness;

}

fn getClearCoatParams(mat: MaterialInputs, pixel: ptr<function, PixelInfo>) {
    (*pixel).clearCoat = mat.clearCoat;
    (*pixel).clearCoatRoughness = mat.clearCoatRoughness * mat.clearCoatRoughness;
}

fn getEnergyCompensationParams(pixel: ptr<function, PixelInfo>) {
    // will be replaced with IBL
    (*pixel).dfg = vec3f(1.0);
    (*pixel).energyCompensation = 1.0 + (*pixel).f0 * (1.0 / (*pixel).dfg.y - 1.0);
}

fn getPixelParams(mat: MaterialInputs) -> PixelInfo {
    var pixel: PixelInfo;
    getMaterialParams(mat, &pixel);
    getClearCoatParams(mat, &pixel);
    getEnergyCompensationParams(&pixel);
    return pixel;
}
