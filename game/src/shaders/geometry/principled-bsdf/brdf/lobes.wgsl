/*
    --------------------------------------------------------------------------------------------------
    Lobes
    --------------------------------------------------------------------------------------------------
*/

fn clearCoatLobe(pixel: PixelInfo, H: vec3f, NoH: f32, LoH: f32, Fcc: ptr<function, f32>) -> f32 {
    var D = distributionClearCoat(pixel.clearCoatRoughness, NoH, H);
    var V = visibilityClearCoat(LoH);
    var F = F_Schlick_F0f32_F90_VoH(0.04, 1.0, LoH) * pixel.clearCoat;
    (*Fcc) = F;
    return D * V * F;
}

fn isotropicLobe(pixel: PixelInfo, H: vec3f, NoV: f32, NoL: f32, NoH: f32, LoH: f32) -> vec3f {
    var D = distribution(pixel.roughness, NoH, H);
    var V = visibility(pixel.roughness, NoV, NoL);
    var F = fresnel(pixel.f0, LoH);
    return (D * V) * F;
}

fn specularLobe(pixel: PixelInfo, H: vec3f, NoV: f32, NoL: f32, NoH: f32, LoH: f32) -> vec3f {
    return isotropicLobe(pixel, H, NoV, NoL, NoH, LoH);
}

fn diffuseLobe(pixel: PixelInfo, NoV: f32, NoL: f32, LoH: f32) -> vec3f {
    return pixel.diffuse * diffuse(pixel.roughness, NoV, NoL, LoH);
}
