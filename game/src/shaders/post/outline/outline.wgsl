@group(0) @binding(0) var outline_mask: texture_2d<f32>;

struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f
};

@vertex
fn vertex(@builtin(vertex_index) vertexIndex : u32) -> VSOutput {
    var output: VSOutput;

    var pos = array(
        vec2( 1.0,  1.0),
        vec2( 1.0, -1.0),
        vec2(-1.0, -1.0),
        vec2( 1.0,  1.0),
        vec2(-1.0, -1.0),
        vec2(-1.0,  1.0)
    );

    var uv = array(
        vec2(1.0, 0.0),
        vec2(1.0, 1.0),
        vec2(0.0, 1.0),
        vec2(1.0, 0.0),
        vec2(0.0, 1.0),
        vec2(0.0, 0.0)
    );

    output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
    output.uv = uv[vertexIndex];

    return output;
}

@fragment
fn fragment(v: VSOutput) -> @location(0) vec4f {
    let tex_size = vec2<i32>(textureDimensions(outline_mask).xy);
    let uv = vec2<i32>(v.uv * vec2f(tex_size));

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

    if (number_neighbor_colors == 0u) {
        discard;
    }

    // Also add the current color
    if (outline_color.a != 0.0) {
        neighbor_colors[number_neighbor_colors] = outline_color;
        number_neighbor_colors++;
    }

    // Get most predominant outline
    var max_color = outline_color;
    for (var i = 0u; i < number_neighbor_colors; i++) {
        max_color = max(max_color, neighbor_colors[i]);
    }

    return max_color;
}
