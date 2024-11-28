import { RenderResourcePool } from './render_resource_pool';

export interface RenderInitializationResources {
    canvasPreferredTextureFormat: GPUTextureFormat;
    pickingBuffer: GPUBuffer;

    luminanceHistogramBins: number;
    luminanceHistogramBuffer: GPUBuffer;

    renderResourcePool: RenderResourcePool;
}
