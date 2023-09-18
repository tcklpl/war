import { PFXTonemapShader } from "../../../../shaders/pfx_tone_mapping/pfx_tone_mapping_shader";
import { BufferUtils } from "../../../../utils/buffer_utils";
import { RenderInitializationResources } from "../render_initialization_resources";
import { RenderResourcePool } from "../render_resource_pool";
import { RenderStage } from "./render_stage";

export class RenderStagePFXToneMapping implements RenderStage {

    private _shader!: PFXTonemapShader;
    private _pipeline!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _texturesBindGroup!: GPUBindGroup;
    private _optionsBuffer = BufferUtils.createEmptyBuffer(7 * 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    private _optionsBindGroup!: GPUBindGroup;

    private _sampler = device.createSampler({
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge'
    });

    async initialize(resources: RenderInitializationResources) {
        
        await new Promise<void>(r => {
            this._shader = new PFXTonemapShader('pfx and tonemap shader', () => r());
        });

        this._pipeline = await this.createPipeline(resources.canvasPreferredTextureFormat);
        this._optionsBindGroup = this.createOptionsBindGroup();
        this._renderPassDescriptor = this.createRenderPassDescriptor();
    }

    private createPipeline(format: GPUTextureFormat) {
        return device.createRenderPipelineAsync({
            label: `rs pfx and tonemapping pipeline`,
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
                cullMode: 'none'
            }
        });
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [
                {
                    // view: Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 0 },
                    loadOp: 'clear',
                    storeOp: 'store'
                } as GPURenderPassColorAttachment
            ]
        } as GPURenderPassDescriptor;
    }

    private updateBindGroup(pool: RenderResourcePool) {
        this._texturesBindGroup = device.createBindGroup({
            label: 'PFX Textures',
            layout: this._pipeline.getBindGroupLayout(PFXTonemapShader.BINDING_GROUPS.TEXTURES),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: pool.antialiasedTextureView },
                { binding: 2, resource: pool.bloomMips.texture.createView() }
            ]
        });
    }

    private createOptionsBindGroup() {
        return device.createBindGroup({
            label: 'PFX Options',
            layout: this._pipeline.getBindGroupLayout(PFXTonemapShader.BINDING_GROUPS.OPTIONS),
            entries: [
                { binding: 0, resource: { buffer: this._optionsBuffer } }
            ]
        });
    }

    private setColorTexture(colorTex: GPUTextureView) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = colorTex;
    }

    render(pool: RenderResourcePool) {
        
        pool.commandEncoder.pushDebugGroup('PFX and Tonemapper');
        pool.renderPostEffects.writeToBuffer(this._optionsBuffer);
        this.updateBindGroup(pool);
        this.setColorTexture(pool.canvasTextureView);
        const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);

        rpe.setPipeline(this._pipeline);
        rpe.setBindGroup(PFXTonemapShader.BINDING_GROUPS.TEXTURES, this._texturesBindGroup);
        rpe.setBindGroup(PFXTonemapShader.BINDING_GROUPS.OPTIONS, this._optionsBindGroup);
        rpe.draw(6);
        rpe.end();
        pool.commandEncoder.popDebugGroup();
    }

    free() {
        this._optionsBuffer?.destroy();
    }

}
