/*
    --------------------------------------------------------------------------------------------------
    SSAO Blur Shader (Kuwahara filter)

    This filter is used to blur the SSAO noisy pass. The Kuwahara filter separates an area into 4 
    quadrants and sets the current texel output as the mean of the values on the quadrant with less
    standard deviation.
    --------------------------------------------------------------------------------------------------
*/

const QUADRANT_SIZE = 3i;

/*
    Values sent from the vertex shader to the fragment shader
*/
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

@group(0) @binding(0) var ssao_sampler: sampler;
@group(0) @binding(1) var ssao_texture: texture_2d<f32>;

/*
    Calculates a quadrants standard deviation and mean. The return is a vec2f with the standard deviation
    and the mean in this order.
*/
fn getQuadrantInfo(center: vec2f, texelSize: vec2f, x0: i32, y0: i32, x1: i32, y1: i32) -> vec2f {
    var values: array<f32, 25>;
    var curValue = 0i;
    var mean = 0.0;
    var division = f32((QUADRANT_SIZE + 1) * (QUADRANT_SIZE + 1));

    // iterathe through all values on the quadrant
    for (var y = y0; y <= y1; y++) {
        for (var x = x0; x <= x1; x++) {
            // fetch the value
            var offset = vec2f(f32(x), f32(y)) * texelSize;
            var result = textureSample(ssao_texture, ssao_sampler, center + offset).r;

            // add to a list of values to calculate the standard deviation
            values[curValue] = result;
            // add to a sum to calculate the mean
            mean += result;
            curValue++;
        }
    }

    // divide the mean and calculate the standard deviation
    mean /= division;
    var stdDev = 0.0;

    for (var i = 0; i < curValue; i++) {
        stdDev += (values[i] - mean) * (values[i] - mean);
    }

    stdDev /= division;
    return vec2f(sqrt(stdDev), mean);
}

@fragment
fn fragment(v: VSOutput) -> @location(0) f32 {

    var texelSize = 1.0 / vec2f(textureDimensions(ssao_texture));

    /*
        Quadrants:
        1   1   1   1  1/2  2   2   2   2
        1   1   1   1  1/2  2   2   2   2
        1   1   1   1  1/2  2   2   2   2
        1   1   1   1  1/2  2   2   2   2
        1/3 1/3 1/3 1/3 o 2/4 2/4 2/4 2/4
        3   3   3   3  3/4  4   4   4   4
        3   3   3   3  3/4  4   4   4   4
        3   3   3   3  3/4  4   4   4   4
        3   3   3   3  3/4  4   4   4   4
    */

    // first get the quadrant with less standard deviation
    // start with the first quadrant as the default
    var finalQuadrant = getQuadrantInfo(v.uv, texelSize, -QUADRANT_SIZE, -QUADRANT_SIZE, 0, 0);
    var tempQuadrant: vec2f;

    // 2nd quadrant
    tempQuadrant = getQuadrantInfo(v.uv, texelSize, 0, -QUADRANT_SIZE, QUADRANT_SIZE, 0);
    if (tempQuadrant.x < finalQuadrant.x) {
        finalQuadrant = tempQuadrant;
    }

    // 3rd quadrant
    tempQuadrant = getQuadrantInfo(v.uv, texelSize, -QUADRANT_SIZE, 0, 0, QUADRANT_SIZE);
    if (tempQuadrant.x < finalQuadrant.x) {
        finalQuadrant = tempQuadrant;
    }

    // 4th quadrant
    tempQuadrant = getQuadrantInfo(v.uv, texelSize, 0, 0, QUADRANT_SIZE, QUADRANT_SIZE);
    if (tempQuadrant.x < finalQuadrant.x) {
        finalQuadrant = tempQuadrant;
    }
    
    // and then we return the mean of the quadrant with less standard deviation
    return finalQuadrant.y;
}
