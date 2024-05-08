/*
    --------------------------------------------------------------------------------------------------
    Diffuse BRDF Implementations
    --------------------------------------------------------------------------------------------------
*/

fn Fd_Lambert() -> f32 {
    return 1.0 / PI;
}

fn Fd_Burley(roughness: f32, NoV: f32, NoL: f32, LoH: f32) -> f32 {
    var f90 = 0.5 + 2.0 * roughness * LoH * LoH;
    var lightScatter = F_Schlick_F0f32_F90_VoH(1.0, f90, NoL);
    var viewScatter = F_Schlick_F0f32_F90_VoH(1.0, f90, NoV);
    return lightScatter * viewScatter * (1.0 / PI);
}

/*
    --------------------------------------------------------------------------------------------------
    Diffuse BRDF Dispatch
    --------------------------------------------------------------------------------------------------
*/

fn diffuse(roughness: f32, NoV: f32, NoL: f32, LoH: f32) -> f32 {
    // can also be Fd_Lambert
    // TODO: Shader quality control
    return Fd_Burley(roughness, NoV, NoL, LoH);
}
