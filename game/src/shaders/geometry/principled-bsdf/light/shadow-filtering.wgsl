/*
    --------------------------------------------------------------------------------------------------------------------
    UTIL FUNCTIONS
    --------------------------------------------------------------------------------------------------------------------
*/

fn sampleShadowMapAtlasConstricted(uv: vec2f, uv_min: vec2f, uv_max: vec2f) -> f32 {
    var actualUV = clamp(uv, uv_min, uv_max);

    var atlas_dimensions = textureDimensions(sceneShadowAtlas);
    var texel_coords = vec2u(actualUV * vec2f(atlas_dimensions));
    return textureLoad(sceneShadowAtlas, texel_coords, 0); 
}

/*
    --------------------------------------------------------------------------------------------------------------------
    NO SHADOW FILTERING
    --------------------------------------------------------------------------------------------------------------------
*/

fn shadow_filtering_none(params: ShadowCalcParams) -> f32 {
    var depth = sampleShadowMapAtlasConstricted(params.atlas_uv, params.atlas_uv_region_min, params.atlas_uv_region_max);
    return select(0.0, 1.0, (params.light_projected_depth - params.bias) > depth);
}

/*
    --------------------------------------------------------------------------------------------------------------------
    SIMPLE PCF POISSON DISK FILTERING
    --------------------------------------------------------------------------------------------------------------------
*/

fn shadow_filtering_pcf(params: ShadowCalcParams) -> f32 {
    var shadow = 0.0;
    for (var i = 0; i < 8; i++) {
        var offset = poissonDisk8n1[i] * params.texel_size;
        var depth = sampleShadowMapAtlasConstricted(
            params.atlas_uv + offset,
            params.atlas_uv_region_min,
            params.atlas_uv_region_max
        );
        shadow += select(0.0, 1.0, (params.light_projected_depth - params.bias) > depth);
    }
    return shadow / 8.0;
}

/*
    --------------------------------------------------------------------------------------------------------------------
    PCSS + PCF
    --------------------------------------------------------------------------------------------------------------------
*/

fn depth_gradient(uv: vec2f, z: f32) -> vec2f {
    var dz_duv = vec2f(0.0, 0.0);

    let duvdist_dx = dpdx(vec3f(uv, z));
    let duvdist_dy = dpdy(vec3f(uv, z));

    dz_duv.x = duvdist_dy.y * duvdist_dx.z;
    dz_duv.x -= duvdist_dx.y * duvdist_dy.z;
    
    dz_duv.y = duvdist_dx.x * duvdist_dy.z;
    dz_duv.y -= duvdist_dy.x * duvdist_dx.z;

    let det = (duvdist_dx.x * duvdist_dy.y) - (duvdist_dx.y * duvdist_dy.x);
    dz_duv /= det;

    return dz_duv;
}

fn biased_z(z0: f32, dz_duv: vec2f, offset: vec2f) -> f32 {
    return z0 + dot(dz_duv, offset);
}

fn pcss_find_avg_blocker_depth(
    shadow_uv: vec2f, 
    uv_min: vec2f, 
    uv_max: vec2f, 
    receiver_depth: f32,
    penumbra_radius: f32,
    texel_size: vec2f,
    dz_duv: vec2f
) -> f32 {
    var blocker_sum = 0.0;
    var num_blockers = 0;

    for (var i = 0; i < 16; i += 1) {
        let offset = poissonDisk16n2[i] * penumbra_radius * length(texel_size); // Scale disk points by penumbra radius
        let sample_uv = shadow_uv + offset;
        let sample_depth = sampleShadowMapAtlasConstricted(sample_uv, uv_min, uv_max);
        let z = biased_z(receiver_depth, dz_duv, offset);

        if (sample_depth < z) {
            blocker_sum += sample_depth;
            num_blockers += 1;
        }
    }

    if (num_blockers == 0) {
        return -1.0; // No blockers found
    }

    return blocker_sum / f32(num_blockers);
}

fn pcss_compute_penumbra_radius(blocker_depth: f32, receiver_depth: f32, light_radius: f32) -> f32 {
    if (blocker_depth < 0.0) {
        return 0.0; // No blockers, hard shadow
    }
    return light_radius * (receiver_depth - blocker_depth) / blocker_depth;
}

fn shadow_filtering_pcss_pcf(params: ShadowCalcParams) -> f32 {
    let dz_duv = depth_gradient(params.atlas_uv, params.light_projected_depth);

    // Blocker search
    let blocker_avg_depth = pcss_find_avg_blocker_depth(
        params.atlas_uv, 
        params.atlas_uv_region_min, 
        params.atlas_uv_region_max, 
        params.light_projected_depth, 
        3.0,
        params.texel_size,
        dz_duv
    );

    // Compute penumbra radius
    var penumbra_radius = pcss_compute_penumbra_radius(blocker_avg_depth, params.light_projected_depth, params.light_radius);

    // PCF with scaled kernel
    var shadow_sum = 0.0;
    var samples = 32;

    for (var i = 0; i < samples; i++) {
        var offset = poissonDisk32n1[i] * params.texel_size * penumbra_radius;
        var depth = sampleShadowMapAtlasConstricted(
            params.atlas_uv + offset,
            params.atlas_uv_region_min,
            params.atlas_uv_region_max
        );
        let z = biased_z(params.light_projected_depth, dz_duv, offset);
        shadow_sum += select(0.0, 1.0, (z - params.bias) > depth);
    }

    return shadow_sum / f32(samples); // Final shadow intensity
}


/*
    --------------------------------------------------------------------------------------------------------------------
    FINAL DISPATCH
    --------------------------------------------------------------------------------------------------------------------
*/

fn shadowFiltering(params: ShadowCalcParams) -> f32 {
    if (shadow_filtering == SHADOW_FILTERING_OFF) {
        return shadow_filtering_none(params);
    }
    else if (shadow_filtering == SHADOW_FILTERING_PCF) {
        return shadow_filtering_pcf(params);
    }
    else if (shadow_filtering == SHADOW_FILTERING_PCSS_PCF) {
        return shadow_filtering_pcss_pcf(params);
    }
    else {
        return 0.0;
    }
}