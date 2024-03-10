import { HistogramShader } from "../../../../shaders/post/auto_exposure/histogram_shader";
import { LuminanceReducerShader } from "../../../../shaders/post/auto_exposure/luminance_reducer_shader";
import { Shader } from "../../../../shaders/shader";
import { BufferUtils } from "../../../../utils/buffer_utils";
import { Texture } from "../../../data/texture/texture";
import { RenderInitializationResources } from "../render_initialization_resources";
import { RenderResourcePool } from "../render_resource_pool";
import { RenderStage } from "./render_stage";

export class RenderStageExposureCalculation implements RenderStage {

    private _chunkSize!: number;
    private _chunksAcross = 0;
    private _chunksDown = 0;
    private _numChunks = 0;

    private _chunksBuffer!: GPUBuffer;
    private _resultBuffer!: GPUBuffer;

    private _histShader!: HistogramShader;
    private _histPipeline!: GPUComputePipeline;

    private _reduceShader!: LuminanceReducerShader;
    private _reducePipeline!: GPUComputePipeline;
    private _histBindGroup!: GPUBindGroup;
    private _reduceBindGroups: {buffer: GPUBuffer, bindGroup: GPUBindGroup}[] = [];

    private _optionsBuffer = BufferUtils.createEmptyBuffer(7 * 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

    async initialize(resources: RenderInitializationResources) {
        
        await new Promise<void>(r => {
            this._histShader = new HistogramShader('histogram shader', () => r());
        });

        await new Promise<void>(r => {
            this._reduceShader = new LuminanceReducerShader('luminance reducer shader', () => r());
        });

        this._histPipeline = await this.createComputePipeline(this._histShader);
        this._reducePipeline = await this.createComputePipeline(this._reduceShader);        

        this._chunkSize = resources.luminanceHistogramBins;
        this._resultBuffer = resources.luminanceHistogramBuffer;
    }

    private createComputePipeline(shader: Shader) {
        return device.createComputePipelineAsync({
            label: `rs pfx and tonemapping pipeline`,
            layout: 'auto',
            compute: {
                module: shader.module,
                entryPoint: 'cs'
            }
        });
    }

    private createHistogramBindGroup(tex: Texture) {
        return device.createBindGroup({
            layout: this._histPipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: this._chunksBuffer }},
                { binding: 1, resource: tex.view },
            ],
        });
    }

    private updateForCurrentRender(pool: RenderResourcePool) {
        const frameChunksAcross = Math.ceil(pool.resolution.full.x / this._chunkSize);
        const frameChunksDown = Math.ceil(pool.resolution.full.y);
        const frameNumChunks = frameChunksAcross * frameChunksDown;

        if (frameNumChunks !== this._numChunks) {
            this._chunksAcross = frameChunksAcross;
            this._chunksDown = frameChunksDown;
            this._numChunks = frameNumChunks;

            this._chunksBuffer?.destroy();
            this._chunksBuffer = BufferUtils.createEmptyBuffer(
                this._numChunks * this._chunkSize * 4,
                GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
                'chunks buffer'
            );
            
            this._reduceBindGroups.forEach(rbg => rbg.buffer?.destroy());
            this._reduceBindGroups = [];
            const reduceSteps = Math.ceil(Math.log2(frameNumChunks));
            for (let i = 0; i < reduceSteps; i++) {
                const stride = 2 ** i;
                const uniformBuffer = device.createBuffer({
                    size: 4,
                    usage: GPUBufferUsage.UNIFORM,
                    mappedAtCreation: true
                });
                new Uint32Array(uniformBuffer.getMappedRange()).set([stride]);
                uniformBuffer.unmap();

                const chunkSumBindGroup = device.createBindGroup({
                    layout: this._reducePipeline.getBindGroupLayout(0),
                    entries: [
                        { binding: 0, resource: { buffer: this._chunksBuffer }},
                        { binding: 1, resource: { buffer: uniformBuffer }}
                    ]
                });
                this._reduceBindGroups.push({ buffer: uniformBuffer, bindGroup: chunkSumBindGroup });
            }
        }

        this._histBindGroup = this.createHistogramBindGroup(pool.hdrBufferChain.current);
    }

    render(pool: RenderResourcePool) {
        
        pool.commandEncoder.pushDebugGroup('PFX and Tonemapper');
        this.updateForCurrentRender(pool);
        const pass = pool.commandEncoder.beginComputePass();

        pass.setPipeline(this._histPipeline);
        pass.setBindGroup(HistogramShader.BINDING_GROUPS.DATA, this._histBindGroup);
        pass.dispatchWorkgroups(this._chunksAcross, this._chunksDown);
        
        pass.setPipeline(this._reducePipeline);
        let chunksLeft = this._numChunks;
        this._reduceBindGroups.forEach(rbg => {
            pass.setBindGroup(LuminanceReducerShader.BINDING_GROUPS.DATA, rbg.bindGroup);
            const dispatchCount = Math.floor(chunksLeft / 2);
            chunksLeft -= dispatchCount;
            pass.dispatchWorkgroups(dispatchCount);
        })

        pass.end();
        pool.commandEncoder.copyBufferToBuffer(this._chunksBuffer, 0, this._resultBuffer, 0, this._resultBuffer.size);
        pool.commandEncoder.popDebugGroup();
    }

    free() {
        this._optionsBuffer?.destroy();
    }

}
