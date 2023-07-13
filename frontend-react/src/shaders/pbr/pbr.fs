#version 300 es

precision highp float;

in vec2 v_uv;
in vec3 v_w_normal;

// the following line will be replaced by #DEFINEs before compiling the shader
//--[DEFINITIONS]--

/*
    Color

    Currently two options are possible: albedo map or colid color.
    The albedo map takes priority if by some reason both are present.
    If no color is present the default color of white will be used.
*/
#ifdef USE_ALBEDO_MAP
    uniform sampler2D u_map_albedo;
#else
    #ifdef USE_SOLID_COLOR
        uniform vec4 u_color;
    #endif
#endif

#ifdef USE_NORMAL_MAP
    uniform sampler2D u_map_normal;
    in vec3 v_w_tangent;
    in vec3 v_w_bitangent;
#endif

out vec4 out_diffuse;

vec4 getColor() {
    #ifdef USE_ALBEDO_MAP
        return texture(u_map_albedo, v_uv);
    #else
        #ifdef USE_SOLID_COLOR
            return u_color;
        #else
            return vec4(1.0);
        #endif
    #endif
}

vec3 getNormalVector() {
    #ifdef USE_NORMAL_MAP
        vec4 normalMapTexel = texture(u_map_normal, v_uv);
        vec3 rawNormal = normalize(normalMapTexel.rgb * 2.0 - 1.0);
        mat3 tbn = mat3(
            v_w_tangent,
            v_w_bitangent,
            v_w_normal
        );
        return normalize(tbn * rawNormal);
    #else
        return v_w_normal;
    #endif
}

void main() {

    out_diffuse = getColor();
}