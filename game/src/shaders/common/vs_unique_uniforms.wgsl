struct VSUniqueUniforms {
    model: mat4x4f,
    model_inverse: mat4x4f,
    previous_model: mat4x4f,
    overlay: vec4f,
    id: u32,
    flags: u32,
};

const FLAG_OUTLINE = 1 << 0;
