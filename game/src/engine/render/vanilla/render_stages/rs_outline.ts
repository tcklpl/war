import { OutlineShader } from '../../../../shaders/post/outline/outline_shader';
import { RenderInitializationResources } from '../render_initialization_resources';
import { RenderResourcePool } from '../render_resource_pool';
import { RenderStage } from './render_stage';

export class RenderStageOutline implements RenderStage {
    private _outlineShader!: OutlineShader;
    private _pipeline!: GPUComputePipeline;
    private _bindGroup!: GPUBindGroup;

    async initialize(resources: RenderInitializationResources) {
        await new Promise<void>(r => {
            this._outlineShader = new OutlineShader('outline compute shader', () => r());
        });
        this._pipeline = await this.createComputePipeline();
        this.updateBindGroup(resources.renderResourcePool);
    }

    private createComputePipeline() {
        return device.createComputePipelineAsync({
            label: `outline compute pipeline`,
            layout: 'auto',
            compute: {
                module: this._outlineShader.module,
                entryPoint: 'main',
            },
        });
    }

    render(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('Outline');

        const frameChunksAcross = Math.ceil(pool.resolution.full.x / 8);
        const frameChunksDown = Math.ceil(pool.resolution.full.y / 8);

        const pass = pool.commandEncoder.beginComputePass();
        pass.setPipeline(this._pipeline);
        pass.setBindGroup(OutlineShader.BINDING_GROUPS.TEXTURES, this._bindGroup);
        pass.dispatchWorkgroups(frameChunksAcross, frameChunksDown);

        pass.end();
        pool.commandEncoder.popDebugGroup();
    }

    onScreenResize(pool: RenderResourcePool) {
        this.updateBindGroup(pool);
    }

    private updateBindGroup(pool: RenderResourcePool) {
        this._bindGroup = device.createBindGroup({
            layout: this._pipeline.getBindGroupLayout(OutlineShader.BINDING_GROUPS.TEXTURES),
            entries: [
                { binding: 0, resource: pool.outlineMaskView },
                { binding: 1, resource: pool.outlineTextureView },
            ],
        });
    }
}
