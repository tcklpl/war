import { EntityFlag } from ':engine/data/entity/entity_flag';
import { PrimitiveDrawOptions } from ':engine/data/meshes/primitive_draw_options';
import { OutlineMaskShader } from '../../../../shaders/post/outline/outline_mask_shader';
import { OutlineShader } from '../../../../shaders/post/outline/outline_shader';
import { RenderInitializationResources } from '../render_initialization_resources';
import { RenderResourcePool } from '../render_resource_pool';
import { RenderStage } from './render_stage';

export class RenderStageOutline implements RenderStage {
    private _outlineMaskShader!: OutlineMaskShader;
    private _outlineMaskPipelineCW!: GPURenderPipeline;
    private _outlineMaskPipelineCCW!: GPURenderPipeline;
    private _outlineMaskRenderPassDescriptor!: GPURenderPassDescriptor;
    private _viewProjBindGroupCW!: GPUBindGroup;
    private _viewProjBindGroupCCW!: GPUBindGroup;
    private readonly _meshDrawOptions = new PrimitiveDrawOptions().includePosition(0);

    private _outlineShader!: OutlineShader;
    private _outlineCalcPipeline!: GPUComputePipeline;
    private _calcBindGroup!: GPUBindGroup;

    async initialize(resources: RenderInitializationResources) {
        await this.initializeMasking(resources);
        await this.initializeOutlineCalc(resources);
        this.updateBindGroup(resources.renderResourcePool);
    }

    private async initializeMasking(resources: RenderInitializationResources) {
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

    private async initializeOutlineCalc(resources: RenderInitializationResources) {
        await new Promise<void>(r => {
            this._outlineShader = new OutlineShader('outline compute shader', () => r());
        });

        this._outlineCalcPipeline = await this.createComputePipeline();
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
        this.maskOutline(pool);
        this.calculateOutline(pool);
        pool.commandEncoder.popDebugGroup();
    }

    private maskOutline(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('Masking');
        this.setMaskTexture(pool.outlineMaskView);

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

    private setMaskTexture(outlineMaskTex: GPUTextureView) {
        (this._outlineMaskRenderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view =
            outlineMaskTex;
    }

    private calculateOutline(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('Calculating');
        const frameChunksAcross = Math.ceil(pool.resolution.full.x / 8);
        const frameChunksDown = Math.ceil(pool.resolution.full.y / 8);

        const pass = pool.commandEncoder.beginComputePass();
        pass.setPipeline(this._outlineCalcPipeline);
        pass.setBindGroup(OutlineShader.BINDING_GROUPS.TEXTURES, this._calcBindGroup);
        pass.dispatchWorkgroups(frameChunksAcross, frameChunksDown);
        pass.end();
        pool.commandEncoder.popDebugGroup();
    }

    onScreenResize(pool: RenderResourcePool) {
        this.updateBindGroup(pool);
    }

    private updateBindGroup(pool: RenderResourcePool) {
        this._calcBindGroup = device.createBindGroup({
            layout: this._outlineCalcPipeline.getBindGroupLayout(OutlineShader.BINDING_GROUPS.TEXTURES),
            entries: [
                { binding: 0, resource: pool.outlineMaskView },
                { binding: 1, resource: pool.outlineTextureView },
            ],
        });
    }
}
