#version 300 es

precision highp float;
precision highp int;

const int MAX_LIGHTS = 3;

#ifndef LIGHTINFO_STRUCT_H
#define LIGHTINFO_STRUCT_H
struct LightInfo {
    vec3 reverse_light_direction;
    vec4 color;
    vec3 position;
    float intensity;
};
#endif

in vec2 vtf_tex_coord;
in vec4 vtf_projected_tex_coords[MAX_LIGHTS];
in vec3 vtf_normal;
in vec3 vtf_frag_pos;

uniform sampler2D u_map_albedo;
uniform sampler2D u_map_normal;

uniform sampler2D u_shadow_atlas;

uniform LightInfo u_lights[MAX_LIGHTS];
uniform int u_present_lights;

out vec4 out_color;

const vec4 AMBIENT_LIGHT = 0.1 * vec4(0.8, 0.8, 1, 1);
const float BIAS = -0.006;

float calculateShadowPCF(vec2 projectedCoords, float currentDepth, sampler2D map) {
    float shadow = 0.0;
    ivec2 textureSize2D = textureSize(map, 0);
    vec2 texelSize = vec2(1.0 / float(textureSize2D.x));
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            float depthPcf = texture(map, projectedCoords + vec2(x, y) * texelSize).r;
            shadow += (currentDepth) < depthPcf ? 1.0 : 0.0;
        }
    }
    return shadow /= 9.0;
}

float calculateLightIncidence(vec3 position, vec3 lightPosition, float intensity) {
    float d = distance(position, lightPosition);
    return intensity / (1.0 + d * d);
}

bool isInRange(vec2 tex_coord) {
    return tex_coord.x >= 0.0 && tex_coord.x <= 1.0 && tex_coord.y >= 0.0 && tex_coord.y <= 1.0;
}

void main() {
    // TODO: normal mapping
    vec3 testNormal = texture(u_map_normal, vtf_tex_coord).rgb;
    vec3 normal = normalize(vtf_normal);

    float fragmentDirectLight = 0.0;
    float fragmentLightMultiplier = 1.0;

    // calculate for all light sources
    for (int i = 0; i < 3; i++) {
        // if (i >= u_present_lights) break;
        // direct light as the dot product with the light source
        fragmentDirectLight += dot(normal, u_lights[i].reverse_light_direction);

        // shadow map coords
        vec3 projectedShadowMapCoords = vtf_projected_tex_coords[i].xyz / vtf_projected_tex_coords[i].w;
        float projectedCurrentDepth = projectedShadowMapCoords.z + BIAS;
        float projectedDepth = texture(u_lights[i].shadow_map, projectedShadowMapCoords.xy).r;
        float projectedShadowLight = projectedCurrentDepth < projectedDepth ? 1.0 : 0.0;

        float shadowMultiplier = isInRange(projectedShadowMapCoords.xy) ? clamp(projectedShadowLight, 0.3, 1.0) : 1.0;
        fragmentLightMultiplier *= shadowMultiplier;
    }

    fragmentDirectLight = clamp(fragmentDirectLight, 0.1, 1.0);
    
    // vec3 projectedTexcoord = vtf_projected_tex_coords[0].xyz / vtf_projected_tex_coords[0].w;

    // float currentDepth = projectedTexcoord.z + BIAS;
    // float projectedDepth = texture(u_lights[0].shadow_map, projectedTexcoord.xy).r;
    // float shadow = currentDepth < projectedDepth ? 1.0 : 0.0;

    // float shadow_light = isInRange(projectedTexcoord.xy) ? clamp(shadow, 0.5, 1.0) : 1.0;

    float at = calculateLightIncidence(vtf_frag_pos, u_lights[0].position, u_lights[0].intensity);

    vec4 tex_color = texture(u_map_albedo, vtf_tex_coord);
    int aa = u_present_lights + 1;
    vec3 col = mix(tex_color.rgb, u_lights[0].color.rgb, at);

    out_color = vec4(col * fragmentLightMultiplier * clamp(fragmentDirectLight, 0.3, 1.0), 1.0);
}