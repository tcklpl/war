/*
    --------------------------------------------------------------------------------------------------
    Specular BRDF Implementations
    --------------------------------------------------------------------------------------------------
*/

fn D_GGX(roughness: f32, NoH: f32, H: vec3f) -> f32 {
    var oneMinusNoH2 = 1.0 - (NoH * NoH);
    var a = NoH * roughness;
    var k = roughness / (oneMinusNoH2 + a * a);
    var d = k * k * (1.0 / PI);
    return saturate(d);
}

fn D_GGX_Anisotropic(at: f32, ab: f32, ToH: f32, BoH: f32, NoH: f32) -> f32 {
    var a2 = at * ab;
    var d = vec3f(ab * ToH, at * BoH, a2 * NoH);
    var d2 = dot(d, d);
    var b2 = a2 / d2;
    return a2 * b2 * b2 * (1.0 / PI);
}

fn V_SmithGGXCorrelated(roughness: f32, NoV: f32, NoL: f32) -> f32 {
    var a2 = roughness * roughness;
    var GGXl = NoV * sqrt((NoL - a2 * NoL) * NoL + a2);
    var GGXv = NoL * sqrt((NoV - a2 * NoV) * NoV + a2);
    var v = 0.5 / (GGXv + GGXl);
    return saturate(v);
}

fn V_SmithGGXCorrelated_Fast(roughness: f32, NoV: f32, NoL: f32) -> f32 {
    var v = 0.5 / mix(2.0 * NoL * NoV, NoL + NoV, roughness);
    return saturate(v);
}

fn V_SmithGGXCorrelated_Anisotropic(at: f32, ab: f32, ToV: f32, BoV: f32, ToL: f32, BoL: f32, NoV: f32, NoL: f32) -> f32 {
    var lambdaV = NoL * length(vec3(at * ToV, ab * BoV, NoV));
    var lambdaL = NoV * length(vec3(at * ToL, ab * BoL, NoL));
    var v = 0.5 / (lambdaV + lambdaL);
    return saturate(v);
}

fn V_Kelemen(LoH: f32) -> f32 {
    var v = 0.25 / (LoH * LoH);
    return saturate(v);
}

fn F_Schlick_F0vec3f_F90_VoH(f0: vec3f, f90: f32, VoH: f32) -> vec3f {
    return f0 + (f90 - f0) * pow(1.0 - VoH, 5.0);
}

fn F_Schlick_F0f32_F90_VoH(f0: f32, f90: f32, VoH: f32) -> f32 {
    return f0 + (f90 - f0) * pow(1.0 - VoH, 5.0);
}

fn F_Schlick_Roughness(f0: vec3f, roughness: f32, NoV: f32) -> vec3f {
    return f0 + (max(vec3f(1.0 - roughness), f0) - f0) * pow(saturate(1.0 - NoV), 5.0);
}

/*
    --------------------------------------------------------------------------------------------------
    Specular BRDF Dispatch
    --------------------------------------------------------------------------------------------------
*/

fn distribution(roughness: f32, NoH: f32, H: vec3f) -> f32 {
    return D_GGX(roughness, NoH, H);
}

fn distributionAnisotropic(at: f32, ab: f32, ToH: f32, BoH: f32, NoH: f32) -> f32 {
    return D_GGX_Anisotropic(at, ab, ToH, BoH, NoH);
}

fn distributionClearCoat(roughness: f32, NoH: f32, H: vec3f) -> f32 {
    return D_GGX(roughness, NoH, H);
}

fn visibility(roughness: f32, NoV: f32, NoL: f32) -> f32 {
    if (shader_quality >= SHADER_QUALITY_NORMAL) {
        return V_SmithGGXCorrelated(roughness, NoV, NoL);
    }
    // Low and below
    else {
        return V_SmithGGXCorrelated_Fast(roughness, NoV, NoL);
    }
}

fn visibilityAnisotropic(roughness: f32, at: f32, ab: f32, ToV: f32, BoV: f32, ToL: f32, BoL: f32, NoV: f32, NoL: f32) -> f32 {
    return V_SmithGGXCorrelated_Anisotropic(at, ab, ToV, BoV, ToL, BoL, NoV, NoL);
}

fn visibilityClearCoat(LoH: f32) -> f32 {
    return V_Kelemen(LoH);
}

fn fresnel(f0: vec3f, LoH: f32) -> vec3f {
    var f90 = clamp(dot(f0, vec3f(50.0 * 0.33)), 0.0, 1.0);
    return F_Schlick_F0vec3f_F90_VoH(f0, f90, LoH);
}
