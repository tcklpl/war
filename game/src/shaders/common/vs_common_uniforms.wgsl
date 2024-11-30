/*
    Vertex uniforms what are common to every entity on the scane (on the same frame)
*/
struct VSCommonUniforms {
    camera: mat4x4f,
    camera_inverse: mat4x4f,
    previous_camera: mat4x4f,
    projection: mat4x4f,
    previous_projection: mat4x4f,
    camera_position: vec3f,
    jitter: vec2f,
};
