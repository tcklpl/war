/*
    --------------------------------------------------------------------------------------------------
    Util Functions
    --------------------------------------------------------------------------------------------------
*/

fn IORtoF0(ior: f32) -> f32 {
    var division = (ior - 1.0) / (ior + 1.0);
    return division * division;
}

fn calculateNormal(uv: vec2f, normalSample: vec3f, normal: vec3f, tangent: vec3f, bitangent: vec3f) -> vec3f {
    var rawNormal = normalize(normalSample.rgb * 2.0 - 1.0);
    var tbn = mat3x3(
        tangent,
        bitangent,
        normal
    );
    return normalize(tbn * rawNormal);
}
