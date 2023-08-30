import { Scene } from "../../data/scene/scene";

export class RenderResourcePool {

    commandEncoder!: GPUCommandEncoder;
    scene!: Scene;

    depthTextureView!: GPUTextureView;
    canvasTextureView!: GPUTextureView;

    viewProjBuffer!: GPUBuffer;
    
    
}