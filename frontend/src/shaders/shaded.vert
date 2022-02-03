#version 300 es

precision highp float;
precision highp int;

const int MAX_LIGHTS = 3;
const int MAX_SHADOWS = 64;

#ifndef LIGHTINFO_STRUCT_H
#define LIGHTINFO_STRUCT_H
struct LightInfo {
    vec3 reverse_light_direction;
    vec4 color;
    vec3 position;
    float intensity;
};
struct ShadowInfo {
    vec3 position; // [offsetX, offsetY, size]
    mat4 texture_matrix;
};
#endif

layout (location = 0) in vec3 a_pos;
layout (location = 1) in vec2 a_uv;
layout (location = 2) in vec3 a_normal;

out vec2 vtf_tex_coord;
out vec4 vtf_projected_tex_coords[MAX_LIGHTS];
out vec4 vtf_shadow_tex_coords[MAX_SHADOWS]; // <- novo
out vec3 vtf_normal;
out vec3 vtf_frag_pos;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

uniform LightInfo u_lights[MAX_LIGHTS];
uniform ShadowInfo u_shadows[MAX_SHADOWS]; // <- novo
uniform int u_present_lights;
uniform int u_present_shadows; // <- novo

void main() {
    vec4 world_pos = u_model * vec4(a_pos, 1.0);
    gl_Position = u_projection * u_view * world_pos;
    vtf_tex_coord = a_uv;

    for (int i = 0; i < u_present_shadows; i++) {
        vec4 projected = u_shadows[i].texture_matrix * world_pos;
        
    }

    for (int i = 0; i < u_present_lights; i++) {
        vtf_projected_tex_coords[i] = u_lights[i].texture_matrix * world_pos;
    }
    
    vtf_normal = mat3(u_model) * a_normal;
    vtf_frag_pos = world_pos.xyz / world_pos.w;
}