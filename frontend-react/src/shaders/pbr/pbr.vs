#version 300 es

precision highp float;

layout (location = 0) in vec3 a_position;
layout (location = 1) in vec2 a_uv;
layout (location = 2) in vec3 a_normal;
layout (location = 3) in vec4 a_tangent;

layout (std140) uniform bu_view_projection {
    mat4 view;
    mat4 projection;
};

uniform mat4 u_world;

out vec2 v_uv;

out vec3 v_w_normal;
#ifdef USE_NORMAL_MAP
    out vec3 v_w_tangent;
    out vec3 v_w_bitangent;
#endif

void main() {

    // normals
    mat3 world3x3 = mat3(inverse(u_world));
    v_w_normal = world3x3 * normalize(a_normal);
    #ifdef USE_NORMAL_MAP
        v_w_tangent = world3x3 * normalize(a_tangent.xyz);
        vec3 bitangent = cross(a_normal, a_tangent.xyz) * a_tangent.w;
        v_w_bitangent = world3x3 * normalize(bitangent);
    #endif

    // send UV coordinates to the fragment shader
    v_uv = a_uv;

    gl_Position = projection * view * u_world * vec4(a_position, 1.0);
}