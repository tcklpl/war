@group(0) @binding(0) var outline_mask: texture_2d<f32>;
@group(0) @binding(1) var outline_texture: texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let tex_size = vec2<i32>(textureDimensions(outline_mask).xy);
    let uv = vec2<i32>(global_id.xy);

    if (uv.x >= tex_size.x || uv.y >= tex_size.y) {
        return; // Ignore out-of-bounds threads
    }

    let outline_color = textureLoad(outline_mask, uv, 0);

    let kernel_offsets = array<vec2<i32>, 8>(
        vec2<i32>(-1, 0), vec2<i32>(1, 0),  // Left, Right
        vec2<i32>(0, -1), vec2<i32>(0, 1), // Top, Bottom
        vec2<i32>(-1, -1), vec2<i32>(1, -1), // Diagonals
        vec2<i32>(-1, 1), vec2<i32>(1, 1)
    );

    var neighbor_colors = array<vec4<f32>, 9>();
    var number_neighbor_colors = 0u;

    // Check the neighborhood for different IDs or background
    for (var i = 0u; i < 8u; i++) {
        let neighbor_coord = uv + kernel_offsets[i];
        if (neighbor_coord.x < 0 || neighbor_coord.y < 0 || 
            neighbor_coord.x >= tex_size.x || neighbor_coord.y >= tex_size.y) {
            continue; // Ignore out-of-bounds neighbors
        }

        let neighbor_color = textureLoad(outline_mask, neighbor_coord, 0);
        if (any(neighbor_color != outline_color)) {
            neighbor_colors[number_neighbor_colors] = neighbor_color;
            number_neighbor_colors++;
        }
    }

    // Write to the outline texture
    if (number_neighbor_colors > 0u) {
        // Also add the current color
        if (outline_color.a != 0.0) {
            neighbor_colors[number_neighbor_colors] = outline_color;
            number_neighbor_colors++;
        }

        // Accumulate outline colors
        let weight = 1.0 / f32(number_neighbor_colors);
        var sum = vec4f(0.0);
        for (var i = 0u; i < number_neighbor_colors; i++) {
            sum += neighbor_colors[i] * weight;
        }

        textureStore(outline_texture, uv, sum);
    } else {
        textureStore(outline_texture, uv, vec4<f32>(0.0, 0.0, 0.0, 0.0));
    }
}