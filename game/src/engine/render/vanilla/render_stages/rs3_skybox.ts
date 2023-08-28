import { Shader } from "../../../../shaders/shader";
import { SkyboxShader } from "../../../../shaders/skybox/skybox_shader";
import { RenderInitializationResources } from "../render_initialization_resources";
import { RenderResourcePool } from "../render_resource_pool";
import { RenderStage } from "./render_stage";

export class RenderStageSkybox implements RenderStage {

    private _shader!: Shader;
    private _pipeline!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _viewProjBindGroup!: GPUBindGroup;

    async initialize(resources: RenderInitializationResources) {
        
        await new Promise<void>(r => {
            this._shader = new SkyboxShader('rs3 skybox shader', () => r());
        });

        this._pipeline = this.createPipeline(resources.canvasPreferredTextureFormat);
        this._renderPassDescriptor = this.createRenderPassDescriptor();
        this._viewProjBindGroup = this.createViewProjBindGroup(resources.viewProjBuffer);
    }

    private createPipeline(format: GPUTextureFormat) {
        return device.createRenderPipeline({
            label: `rs3 skybox pipeline`,
            layout: 'auto',
            vertex: {
                module: this._shader.module,
                entryPoint: 'vertex',
                buffers: [] as GPUVertexBufferLayout[]
            },
            fragment: {
                module: this._shader.module,
                entryPoint: 'fragment',
                targets: [
                    { format: format }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'front'
            },
            depthStencil: {
                depthWriteEnabled: false,
                depthCompare: 'less-equal',
                format: 'depth24plus'
            }
        });
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [
                {
                    // view: undefined, Assigned later
                    // resolveTarget: undefined, Assigned Later
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    loadOp: 'load',
                    storeOp: 'store'
                }
            ] as GPURenderPassColorAttachment[],
            depthStencilAttachment: {
                // view: undefined, Assigned later
                depthReadOnly: true
            } as GPURenderPassDepthStencilAttachment
        } as GPURenderPassDescriptor;
    }

    private createViewProjBindGroup(buffer: GPUBuffer) {
        return device.createBindGroup({
            label: 'PBR ViewProj',
            layout: this._pipeline.getBindGroupLayout(SkyboxShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: buffer }}
            ]
        });
    }

    private setDepthTexture(depthTex: GPUTextureView) {
        (this._renderPassDescriptor.depthStencilAttachment as GPURenderPassDepthStencilAttachment).view = depthTex;
    }

    private setCanvasTexture(canvasTex: GPUTexture) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = gpuCtx.getCurrentTexture().createView();
    }

    render(pool: RenderResourcePool) {

        if (!pool.scene.activeSkybox) return;
        
        this.setDepthTexture(pool.depthTextureView);
        this.setCanvasTexture(pool.canvasTexture);
        const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);

        rpe.setPipeline(this._pipeline);
        rpe.setBindGroup(SkyboxShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ, this._viewProjBindGroup);
        rpe.setBindGroup(SkyboxShader.UNIFORM_BINDING_GROUPS.FRAGMENT_TEXTURE, pool.scene.activeSkybox.getBindGroup(this._pipeline).convolutedSkybox);
        rpe.draw(36);
        rpe.end();

    }

    free() {
        // TODO
    }

}
