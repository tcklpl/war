import { TAAShader } from '../../../../shaders/post/taa/taa_shader';
import { RenderInitializationResources } from '../render_initialization_resources';
import { RenderResourcePool } from '../render_resource_pool';
import { RenderStage } from './render_stage';

export class RenderStageTAA implements RenderStage {
    private _taaShader!: TAAShader;
    private _taaPipeline!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _samplerNearest = device.createSampler({
        minFilter: 'nearest',
        magFilter: 'nearest',
    });
    private _samplerLinear = device.createSampler({
        minFilter: 'linear',
        magFilter: 'linear',
    });

    async initialize(resources: RenderInitializationResources) {
        await new Promise<void>(r => {
            this._taaShader = new TAAShader('taa shader', () => r());
        });

        this._taaPipeline = await this.createTAAPipeline(resources.hdrTextureFormat);
        this._renderPassDescriptor = this.createRenderPassDescriptor();
    }

    private createTAAPipeline(hdrTextureFormat: GPUTextureFormat) {
        return device.createRenderPipelineAsync({
            label: `rs bloom pipeline`,
            layout: 'auto',
            vertex: {
                module: this._taaShader.module,
                entryPoint: 'vertex',
                buffers: [] as GPUVertexBufferLayout[],
            },
            fragment: {
                module: this._taaShader.module,
                entryPoint: 'fragment',
                targets: [{ format: hdrTextureFormat }],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
            },
        });
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [
                {
                    // view: undefined, Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    loadOp: 'load',
                    storeOp: 'store',
                },
            ] as GPURenderPassColorAttachment[],
        } as GPURenderPassDescriptor;
    }

    private createBindGroup(pool: RenderResourcePool) {
        return device.createBindGroup({
            label: 'ssao opt and kernel bind group',
            layout: this._taaPipeline.getBindGroupLayout(TAAShader.BINDING_GROUPS.TEXTURES),
            entries: [
                { binding: 0, resource: this._samplerNearest },
                { binding: 1, resource: this._samplerLinear },
                { binding: 2, resource: pool.hdrBufferChain.current.view },
                { binding: 3, resource: pool.hdrBufferChain.previous.view },
                { binding: 4, resource: pool.velocityTextureView },
            ],
        });
    }

    private setRenderTexture(texView: GPUTextureView) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = texView;
    }

    render(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('TAA Renderer');
        const bindGroup = this.createBindGroup(pool);

        this.setRenderTexture(pool.hdrBufferChain.available.view);
        const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);

        rpe.setPipeline(this._taaPipeline);
        rpe.setBindGroup(TAAShader.BINDING_GROUPS.TEXTURES, bindGroup);
        rpe.draw(6);
        rpe.end();

        // update the hdr chain to notify the next render stages to use the antialiased texture as input
        pool.hdrBufferChain.swapCurrentBuffers();

        pool.commandEncoder.popDebugGroup();
    }

    free() {
        // TODO
    }
}
