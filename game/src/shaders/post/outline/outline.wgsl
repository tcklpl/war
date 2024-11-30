@group(0) @binding(0) var outline_mask: texture_2d<f32>;
@group(0) @binding(1) var outline_texture: texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let texSize = vec2<i32>(textureDimensions(outline_mask).xy);
    let uv = vec2<i32>(global_id.xy);

    if (uv.x >= texSize.x || uv.y >= texSize.y) {
        return; // Ignore out-of-bounds threads
    }

    let outline_color = textureLoad(outline_mask, uv, 0);

    // Define the kernel size (e.g., 3x3)
    let kernel_offsets = array<vec2<i32>, 8>(
        vec2<i32>(-1, 0), vec2<i32>(1, 0),  // Left, Right
        vec2<i32>(0, -1), vec2<i32>(0, 1), // Top, Bottom
        vec2<i32>(-1, -1), vec2<i32>(1, -1), // Diagonals
        vec2<i32>(-1, 1), vec2<i32>(1, 1)
    );

    var is_outline = false;

    // Check the neighborhood for different IDs or background
    for (var i = 0u; i < 8u; i = i + 1u) {
        let neighborCoord = uv + kernel_offsets[i];
        if (neighborCoord.x < 0 || neighborCoord.y < 0 || 
            neighborCoord.x >= texSize.x || neighborCoord.y >= texSize.y) {
            continue; // Ignore out-of-bounds neighbors
        }

        let neighbor_color = textureLoad(outline_mask, neighborCoord, 0);
        if (any(neighbor_color != outline_color)) {
            is_outline = true;
            break;
        }
    }

    // Write to the outline texture
    if (is_outline) {
        textureStore(outline_texture, uv, vec4<f32>(1.0, 1.0, 1.0, 1.0)); // White outline
    } else {
        textureStore(outline_texture, uv, vec4<f32>(0.0, 0.0, 0.0, 0.0));
    }
}