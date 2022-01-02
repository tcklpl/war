#version 300 es

precision highp float;

in vec2 vtf_tex_coord;
in vec3 vtf_normal;
in vec3 vtf_frag_pos;

out vec4 out_color;

uniform sampler2D u_map_albedo;
uniform sampler2D u_map_normal;

uniform vec4 u_overlay_color;

void main() {
    vec4 ambient = 0.1 * vec4(0.8, 0.8, 1, 1);
    vec3 norm = normalize(vtf_normal);
    vec3 testNormal = texture(u_map_normal, vtf_tex_coord).rgb;
    vec3 light_dir = normalize(vec3(0, 3.5, 0) - vtf_frag_pos);
    float diff = max(dot(norm, light_dir), 0.0);
    vec3 diffuse = diff * vec3(1, 1, 1);
    out_color = (texture(u_map_albedo, vtf_tex_coord) + u_overlay_color) * vec4(diffuse, 1.0) + ambient;
    //out_color = vec4(0.8, 0, 0, 1) * (vec4(diffuse, 1.0) + ambient);
}