/*
    --------------------------------------------------------------------------------------------------
    Surface Shading
    --------------------------------------------------------------------------------------------------
*/

fn surfaceShading(pixel: PixelInfo, light: Light, cv: CommonVectors, occlusion: f32) -> vec3f {
    var H = normalize(cv.V + light.L);

    var NoV = cv.NoV;
    var NoL = saturate(light.NoL);
    var NoH = saturate(dot(cv.N, H));
    var LoH = saturate(dot(light.L, H));

    var Fr = specularLobe(pixel, H, NoV, NoL, NoH, LoH);
    var Fd = diffuseLobe(pixel, NoV, NoL, LoH);

    var color = Fd + Fr * pixel.energyCompensation;

    // // Clear Coat
    // var Fcc = 0.0;
    // var clearCoatNoH = saturate(dot(cv.Geometry_N, H));
    // var clearCoatNoL = saturate(dot(cv.Geometry_N, H));
    // var Cc = clearCoatLobe(pixel, H, clearCoatNoH, LoH, &Fcc);
    // var attenuation = 1.0 - Fcc;

    // color *= attenuation * NoL;
    // color += pixel.clearCoat * clearCoatNoL;
    // // End of clear coat

    // return  (color * light.color.rgb) * (light.color.w * light.attenuation * occlusion);

    return (color * light.color.rgb) * (light.color.w * light.attenuation * NoL * occlusion);
}
