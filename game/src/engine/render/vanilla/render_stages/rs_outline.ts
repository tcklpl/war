import { OutlineShader } from '../../../../shaders/post/outline/outline_shader';
import { RenderInitializationResources } from '../render_initialization_resources';
import { RenderResourcePool } from '../render_resource_pool';
import { RenderStage } from './render_stage';

export class RenderStageOutline implements RenderStage {
    private _outlineShader!: OutlineShader;
    private _outlineCalcPipeline!: GPURenderPipeline;
    private _calcBindGroup!: GPUBindGroup;
    private _calcRenderPassDescriptor!: GPURenderPassDescriptor;

    async initialize(resources: RenderInitializationResources) {
        await new Promise<void>(r => {
            this._outlineShader = new OutlineShader('outline compute shader', () => r());
        });

        this._outlineCalcPipeline = await this.createOutlinePipeline();
        this._calcRenderPassDescriptor = this.createRenderPassDescriptor();
        this.updateBindGroup(resources.renderResourcePool);
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [
                // Outline texture
                {
                    // view: undefined, Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ] as GPURenderPassColorAttachment[],
        } as GPURenderPassDescriptor;
    }

    private createOutlinePipeline() {
        return device.createRenderPipelineAsync({
            label: `outline compute pipeline`,
            layout: 'auto',
            vertex: {
                module: this._outlineShader.module,
                entryPoint: 'vertex',
                buffers: [] as GPUVertexBufferLayout[],
            },
            fragment: {
                module: this._outlineShader.module,
                entryPoint: 'fragment',
                targets: [{ format: 'rgba8unorm' }],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
            },
        });
    }

    render(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('Outline');

        this.setTargetTexture(pool.outlineTextureView);
        const pass = pool.commandEncoder.beginRenderPass(this._calcRenderPassDescriptor);
        pass.setPipeline(this._outlineCalcPipeline);
        pass.setBindGroup(OutlineShader.BINDING_GROUPS.TEXTURES, this._calcBindGroup);
        pass.draw(6);
        pass.end();

        pool.commandEncoder.popDebugGroup();
    }

    private setTargetTexture(resolve: GPUTextureView) {
        const colorAttachment = (this._calcRenderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0];
        colorAttachment.view = resolve;
    }

    onScreenResize(pool: RenderResourcePool) {
        this.updateBindGroup(pool);
    }

    private updateBindGroup(pool: RenderResourcePool) {
        this._calcBindGroup = device.createBindGroup({
            layout: this._outlineCalcPipeline.getBindGroupLayout(OutlineShader.BINDING_GROUPS.TEXTURES),
            entries: [{ binding: 0, resource: pool.outlineMaskView }],
        });
    }
}
