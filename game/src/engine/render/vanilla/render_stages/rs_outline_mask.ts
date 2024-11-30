import { EntityFlag } from ':engine/data/entity/entity_flag';
import { PrimitiveDrawOptions } from ':engine/data/meshes/primitive_draw_options';
import { OutlineMaskShader } from '../../../../shaders/post/outline/outline_mask_shader';
import { RenderInitializationResources } from '../render_initialization_resources';
import { RenderResourcePool } from '../render_resource_pool';
import { RenderStage } from './render_stage';

export class RenderStageOutlineMask implements RenderStage {
    private _outlineMaskShader!: OutlineMaskShader;
    private _outlineMaskPipelineCW!: GPURenderPipeline;
    private _outlineMaskPipelineCCW!: GPURenderPipeline;
    private _outlineMaskRenderPassDescriptor!: GPURenderPassDescriptor;
    private _viewProjBindGroupCW!: GPUBindGroup;
    private _viewProjBindGroupCCW!: GPUBindGroup;
    private readonly _meshDrawOptions = new PrimitiveDrawOptions().includePosition(0);

    async initialize(resources: RenderInitializationResources) {
        await new Promise<void>(r => {
            this._outlineMaskShader = new OutlineMaskShader('outline mask shader', () => r());
        });
        this._outlineMaskPipelineCW = await this.createMaskPipeline('cw');
        this._outlineMaskPipelineCCW = await this.createMaskPipeline('ccw');

        this._outlineMaskRenderPassDescriptor = this.createOutlineMaskRenderPassDescriptor();

        this._viewProjBindGroupCW = this.createOutlineMaskBindGroup('cw', resources.renderResourcePool.viewProjBuffer);
        this._viewProjBindGroupCCW = this.createOutlineMaskBindGroup(
            'ccw',
            resources.renderResourcePool.viewProjBuffer,
        );
    }

    private createMaskPipeline(windingOrder: 'cw' | 'ccw') {
        return device.createRenderPipelineAsync({
            label: `outline mask pipeline`,
            layout: 'auto',
            vertex: {
                module: this._outlineMaskShader.module,
                entryPoint: 'vertex',
                buffers: [
                    // position
                    {
                        arrayStride: 3 * 4,
                        attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
                    },
                ] as GPUVertexBufferLayout[],
            },
            fragment: {
                module: this._outlineMaskShader.module,
                entryPoint: 'fragment',
                targets: [{ format: 'rgba8unorm' as GPUTextureFormat }],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
                frontFace: windingOrder,
            },
        });
    }

    private createOutlineMaskRenderPassDescriptor() {
        return {
            colorAttachments: [
                // Outline mask
                {
                    // view: undefined, Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ] as GPURenderPassColorAttachment[],
        } as GPURenderPassDescriptor;
    }

    private createOutlineMaskBindGroup(windingOrder: 'cw' | 'ccw', buffer: GPUBuffer) {
        const pipeline = windingOrder === 'ccw' ? this._outlineMaskPipelineCCW : this._outlineMaskPipelineCW;
        return device.createBindGroup({
            label: 'PBR ViewProj',
            layout: pipeline.getBindGroupLayout(OutlineMaskShader.BINDING_GROUPS.VIEWPROJ),
            entries: [{ binding: 0, resource: { buffer: buffer } }],
        });
    }

    render(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('Outline Masking');
        this.setTargetTexture(pool.outlineMaskView);

        const rpe = pool.commandEncoder.beginRenderPass(this._outlineMaskRenderPassDescriptor);

        if (pool.scene.entitiesPerWindingOrder.ccw.length > 0) {
            rpe.setPipeline(this._outlineMaskPipelineCCW);
            rpe.setBindGroup(OutlineMaskShader.BINDING_GROUPS.VIEWPROJ, this._viewProjBindGroupCCW);
            pool.scene.entitiesPerWindingOrder.ccw
                .filter(e => e.hasFlag(EntityFlag.OUTLINE))
                .forEach(e => e.draw(rpe, this._outlineMaskPipelineCCW, this._meshDrawOptions));
        }

        if (pool.scene.entitiesPerWindingOrder.cw.length > 0) {
            rpe.setPipeline(this._outlineMaskPipelineCW);
            rpe.setBindGroup(OutlineMaskShader.BINDING_GROUPS.VIEWPROJ, this._viewProjBindGroupCW);
            pool.scene.entitiesPerWindingOrder.cw
                .filter(e => e.hasFlag(EntityFlag.OUTLINE))
                .forEach(e => e.draw(rpe, this._outlineMaskPipelineCW, this._meshDrawOptions));
        }

        rpe.end();
        pool.commandEncoder.popDebugGroup();
    }

    private setTargetTexture(resolve: GPUTextureView) {
        const colorAttachment = (
            this._outlineMaskRenderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[]
        )[0];
        colorAttachment.view = resolve;
    }
}
