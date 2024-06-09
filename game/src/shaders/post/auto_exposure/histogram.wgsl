/*
    --------------------------------------------------------------------------------------------------
    Histogram Shader

    TODO: explain
    --------------------------------------------------------------------------------------------------
*/

const chunkWidth  = 256;
const chunkHeight = 1;

const chunkSize = chunkWidth * chunkHeight;
var<workgroup> bins: array<atomic<u32>, chunkSize>;

@group(0) @binding(0) var<storage, read_write> chunks: array<array<u32, chunkSize>>;
@group(0) @binding(1) var ourTexture: texture_2d<f32>;

const kSRGBLuminanceFactors = vec3f(0.2126, 0.7152, 0.0722);
fn srgbLuminance(color: vec3f) -> f32 {
    return saturate(dot(color, kSRGBLuminanceFactors));
}

@compute @workgroup_size(chunkWidth, chunkHeight, 1)
fn cs(
    @builtin(global_invocation_id) global_invocation_id: vec3u,
    @builtin(workgroup_id) workgroup_id: vec3u,
    @builtin(local_invocation_id) local_invocation_id: vec3u,
) {
    let size = textureDimensions(ourTexture, 0);
    let position = global_invocation_id.xy;
    if (all(position < size)) {
        let numBins = f32(chunkSize);
        let lastBinIndex = u32(numBins - 1);
        let color = textureLoad(ourTexture, position, 0);
        let v = srgbLuminance(color.rgb);
        let bin = min(u32(v * numBins), lastBinIndex);
        atomicAdd(&bins[bin], 1u);
    }

    workgroupBarrier();

    let chunksAcross = (size.x + chunkWidth - 1) / chunkWidth;
    let chunk = workgroup_id.y * chunksAcross + workgroup_id.x;
    let bin = local_invocation_id.y * chunkWidth + local_invocation_id.x;

    chunks[chunk][bin] = atomicLoad(&bins[bin]);
}
