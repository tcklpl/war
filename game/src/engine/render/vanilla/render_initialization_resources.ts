
export interface RenderInitializationResources {

    viewProjBuffer: GPUBuffer;
    canvasPreferredTextureFormat: GPUTextureFormat;

    hdrBufferTexture: GPUTexture;
    depthBufferTexture: GPUTexture;
}