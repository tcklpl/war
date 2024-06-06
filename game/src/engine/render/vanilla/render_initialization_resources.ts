import { ShadowMapAtlas } from "../../data/atlas/shadow_map_atlas";

export interface RenderInitializationResources {

    viewProjBuffer: GPUBuffer;
    canvasPreferredTextureFormat: GPUTextureFormat;
    pickingBuffer: GPUBuffer;
    hdrTextureFormat: GPUTextureFormat;
    shadowMapAtlas: ShadowMapAtlas;

    luminanceHistogramBins: number;
    luminanceHistogramBuffer: GPUBuffer;

}