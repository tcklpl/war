import { DepthAndVelocityShader } from '../../../../shaders/geometry/depth/depth_and_velocity_shader';
import { PrimitiveDrawOptions } from '../../../data/meshes/primitive_draw_options';
import { RenderInitializationResources } from '../render_initialization_resources';
import { RenderResourcePool } from '../render_resource_pool';
import { RenderStage } from './render_stage';

export class RenderStageDepthMap implements RenderStage {
    private _depthShader!: DepthAndVelocityShader;
    private _depthPipelineCW!: GPURenderPipeline;
    private _depthPipelineCCW!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _viewProjBindGroupCW!: GPUBindGroup;
    private _viewProjBindGroupCCW!: GPUBindGroup;
    private readonly _meshDrawOptions = new PrimitiveDrawOptions().includePosition(0);

    async initialize(resources: RenderInitializationResources) {
        await new Promise<void>(r => {
            this._depthShader = new DepthAndVelocityShader('rs depth and velocity shader', () => r());
        });

        this._depthPipelineCW = await this.createDepthPipeline('cw');
        this._depthPipelineCCW = await this.createDepthPipeline('ccw');
        this._viewProjBindGroupCW = this.createViewProjBindGroup('cw', resources.viewProjBuffer);
        this._viewProjBindGroupCCW = this.createViewProjBindGroup('ccw', resources.viewProjBuffer);
        this._renderPassDescriptor = this.createRenderPassDescriptor();
    }

    private createDepthPipeline(windingOrder: 'cw' | 'ccw') {
        return device.createRenderPipelineAsync({
            label: `rs depth pass ${windingOrder} pipeline`,
            layout: 'auto',
            vertex: {
                module: this._depthShader.module,
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
                module: this._depthShader.module,
                entryPoint: 'fragment',
                targets: [{ format: 'rg16float' as GPUTextureFormat }],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
                frontFace: windingOrder,
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus',
            },
        });
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [
                // Velocity
                {
                    // view will be assigned later
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ] as GPURenderPassColorAttachment[],
            depthStencilAttachment: {
                // view will be assigned later
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            } as GPURenderPassDepthStencilAttachment,
        } as GPURenderPassDescriptor;
    }

    private createViewProjBindGroup(windingOrder: 'cw' | 'ccw', buffer: GPUBuffer) {
        const pipeline = windingOrder === 'ccw' ? this._depthPipelineCCW : this._depthPipelineCW;
        return device.createBindGroup({
            label: 'PBR ViewProj',
            layout: pipeline.getBindGroupLayout(DepthAndVelocityShader.BINDING_GROUPS.VIEWPROJ),
            entries: [{ binding: 0, resource: { buffer: buffer } }],
        });
    }

    private setVelocityTexture(velocityTex: GPUTextureView) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = velocityTex;
    }

    private setDepthTexture(depthTex: GPUTextureView) {
        (this._renderPassDescriptor.depthStencilAttachment as GPURenderPassDepthStencilAttachment).view = depthTex;
    }

    render(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('Depth Map Renderer');
        this.setDepthTexture(pool.depthTextureView);
        this.setVelocityTexture(pool.velocityTextureView);
        const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);

        if (pool.scene.entitiesPerWindingOrder.ccw.length > 0) {
            rpe.setPipeline(this._depthPipelineCCW);
            rpe.setBindGroup(DepthAndVelocityShader.BINDING_GROUPS.VIEWPROJ, this._viewProjBindGroupCCW);
            pool.scene.entitiesPerWindingOrder.ccw.forEach(e =>
                e.draw(rpe, this._depthPipelineCCW, this._meshDrawOptions),
            );
        }

        if (pool.scene.entitiesPerWindingOrder.cw.length > 0) {
            rpe.setPipeline(this._depthPipelineCW);
            rpe.setBindGroup(DepthAndVelocityShader.BINDING_GROUPS.VIEWPROJ, this._viewProjBindGroupCW);
            pool.scene.entitiesPerWindingOrder.cw.forEach(e =>
                e.draw(rpe, this._depthPipelineCW, this._meshDrawOptions),
            );
        }

        rpe.end();
        pool.commandEncoder.popDebugGroup();
    }
}
