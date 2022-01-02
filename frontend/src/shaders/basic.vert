#version 300 es

layout (location = 0) in vec3 a_pos;
layout (location = 1) in vec2 a_uv;
layout (location = 2) in vec3 a_normal;

out vec2 vtf_tex_coord;
out vec3 vtf_normal;
out vec3 vtf_frag_pos;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_pos, 1.0);
    vtf_tex_coord = a_uv;
    vtf_normal = a_normal;
    vtf_frag_pos = vec3(u_model * vec4(a_pos, 1.0));
}