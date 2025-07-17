import type { RenderResourcePool } from './render-resource-pool';

export interface RenderInitializationResources {
	canvasPreferredTextureFormat: GPUTextureFormat;
	pickingBuffer: GPUBuffer;

	luminanceHistogramBins: number;
	luminanceHistogramBuffer: GPUBuffer;

	renderResourcePool: RenderResourcePool;
}
