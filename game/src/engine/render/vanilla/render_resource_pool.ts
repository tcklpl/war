import { Scene } from "../../data/scene/scene";

export class RenderResourcePool {

    commandEncoder!: GPUCommandEncoder;
    scene!: Scene;

    depthTexture!: GPUTexture;
    depthTextureView!: GPUTextureView;
    canvasTexture!: GPUTexture;

    viewProjBuffer!: GPUBuffer;
    
    
}