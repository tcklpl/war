import { BloomDownsampleShader } from "../../../../shaders/post/bloom/bloom_downsample_shader";
import { BloomUpsampleShader } from "../../../../shaders/post/bloom/bloom_upsample_shader";
import { Shader } from "../../../../shaders/shader";
import { RenderInitializationResources } from "../render_initialization_resources";
import { RenderResourcePool } from "../render_resource_pool";
import { RenderStage } from "./render_stage";

export class RenderStageBloom implements RenderStage {

    private _downsampleShader!: BloomDownsampleShader;
    private _upsampleShader!: BloomUpsampleShader;

    private _downsamplePipeline!: GPURenderPipeline;
    private _upsamplePipeline!: GPURenderPipeline;

    private _renderPassDescriptor!: GPURenderPassDescriptor;

    private _sampler = device.createSampler({
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
        minFilter: 'linear',
        magFilter: 'linear'
    });

    async initialize(resources: RenderInitializationResources) {
        
        await new Promise<void>(r => {
            this._downsampleShader = new BloomDownsampleShader('bloom downsample shader', () => r());
        });

        await new Promise<void>(r => {
            this._upsampleShader = new BloomUpsampleShader('bloom upsample shader', () => r());
        });

        this._downsamplePipeline = await this.createBloomPipeline(this._downsampleShader, resources.hdrTextureFormat);
        this._upsamplePipeline = await this.createBloomPipeline(this._upsampleShader, resources.hdrTextureFormat);

        this._renderPassDescriptor = this.createRenderPassDescriptor();
    }

    private createBloomPipeline(shader: Shader, hdrTextureFormat: GPUTextureFormat) {
        return device.createRenderPipelineAsync({
            label: `rs bloom pipeline`,
            layout: 'auto',
            vertex: {
                module: shader.module,
                entryPoint: 'vertex',
                buffers: [] as GPUVertexBufferLayout[]
            },
            fragment: {
                module: shader.module,
                entryPoint: 'fragment',
                targets: [
                    { format: hdrTextureFormat }
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
                    // view: undefined, Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    loadOp: 'load',
                    storeOp: 'store'
                }
            ] as GPURenderPassColorAttachment[]
        } as GPURenderPassDescriptor;
    }

    private createBindGroup(pipeline: GPURenderPipeline, layoutIndex: number, texView: GPUTextureView) {
        return device.createBindGroup({
            label: 'PBR ViewProj',
            layout: pipeline.getBindGroupLayout(layoutIndex),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: texView }
            ]
        });
    }

    private setRenderTexture(texView: GPUTextureView) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = texView;
    }

    private renderDownsamples(pool: RenderResourcePool) {

        for (let i = 0; i < pool.bloomMipsLength; i++) {

            const sourceTexture = i === 0 ? pool.hdrBufferChain.current.view : pool.bloomMips.texture.createView({
                mipLevelCount: 1,
                baseMipLevel: i - 1
            });

            const targetMip = pool.bloomMips.texture.createView({
                mipLevelCount: 1,
                baseMipLevel: i
            });

            this.setRenderTexture(targetMip);
            const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);            
            const layoutIndex = BloomDownsampleShader.BINDING_GROUPS.TEXTURE;

            rpe.setPipeline(this._downsamplePipeline);
            rpe.setBindGroup(layoutIndex, this.createBindGroup(this._downsamplePipeline, layoutIndex, sourceTexture));
            rpe.draw(6);
            rpe.end();

        }
    }

    private renderUpsamples(pool: RenderResourcePool) {
        
        for (let i = pool.bloomMipsLength - 1; i > 0; i--) {

            const sourceTexture = pool.bloomMips.texture.createView({
                mipLevelCount: 1,
                baseMipLevel: i
            });

            const targetMip = pool.bloomMips.texture.createView({
                mipLevelCount: 1,
                baseMipLevel: i - 1
            });

            this.setRenderTexture(targetMip);
            const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);
            const layoutIndex = BloomUpsampleShader.BINDING_GROUPS.TEXTURE;

            rpe.setPipeline(this._upsamplePipeline);
            rpe.setBindGroup(layoutIndex, this.createBindGroup(this._upsamplePipeline, layoutIndex, sourceTexture));
            rpe.draw(6);
            rpe.end();

        }
    }

    render(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('Bloom Renderer');

        pool.commandEncoder.pushDebugGroup('Downsampler');
        this.renderDownsamples(pool);
        pool.commandEncoder.popDebugGroup();

        pool.commandEncoder.pushDebugGroup('Upsampler');
        this.renderUpsamples(pool);
        pool.commandEncoder.popDebugGroup();

        pool.commandEncoder.popDebugGroup();
    }

    free() {
        // TODO
    }

}
