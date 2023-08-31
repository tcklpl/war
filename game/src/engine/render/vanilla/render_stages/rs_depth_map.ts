import { DepthShader } from "../../../../shaders/depth/depth_shader";
import { Shader } from "../../../../shaders/shader";
import { RenderInitializationResources } from "../render_initialization_resources";
import { RenderResourcePool } from "../render_resource_pool";
import { RenderStage } from "./render_stage";

export class RenderStageDepthMap implements RenderStage {
    
    private _depthShader!: Shader;
    private _depthPipelineCW!: GPURenderPipeline;
    private _depthPipelineCCW!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _viewProjBindGroupCW!: GPUBindGroup;
    private _viewProjBindGroupCCW!: GPUBindGroup;
    private _meshDrawOptions = {
        position: {
            use: true,
            index: 0,
        },
        uv: {
            use: false,
            index: 1
        },
        normal: {
            use: false,
            index: 2
        },
        tangent: {
            use: false,
            index: 3
        },
        useMaterial: false
    };

    async initialize(resources: RenderInitializationResources) {

        await new Promise<void>(r => {
            this._depthShader = new DepthShader('rs depth shader', () => r());
        });

        this._depthPipelineCW = this.createDepthPipeline('cw');
        this._depthPipelineCCW = this.createDepthPipeline('ccw');
        this._viewProjBindGroupCW = this.createViewProjBindGroup('cw', resources.viewProjBuffer);
        this._viewProjBindGroupCCW = this.createViewProjBindGroup('ccw', resources.viewProjBuffer);
        this._renderPassDescriptor = this.createRenderPassDescriptor();
    }

    private createDepthPipeline(windingOrder: 'cw' | 'ccw') {
        return device.createRenderPipeline({
            label: `rs depth pass ${windingOrder} pipeline`,
            layout: 'auto',
            vertex: {
                module: this._depthShader.module,
                entryPoint: 'vertex',
                buffers: [
                    // position
                    {
                        arrayStride: 3 * 4,
                        attributes: [
                            { shaderLocation: 0, offset: 0, format: 'float32x3' }
                        ]
                    }
                ] as GPUVertexBufferLayout[]
            },
            fragment: {
                module: this._depthShader.module,
                entryPoint: 'fragment',
                targets: []
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
                frontFace: windingOrder
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus'
            }
        });
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [] as GPURenderPassColorAttachment[],
            depthStencilAttachment: {
                // view will be assigned later
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'store'
            } as GPURenderPassDepthStencilAttachment
        } as GPURenderPassDescriptor;
    }

    private createViewProjBindGroup(windingOrder: 'cw' | 'ccw', buffer: GPUBuffer) {
        const pipeline = windingOrder === 'ccw' ? this._depthPipelineCCW : this._depthPipelineCW;
        return device.createBindGroup({
            label: 'PBR ViewProj',
            layout: pipeline.getBindGroupLayout(DepthShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: buffer }}
            ]
        });
    }

    private setDepthTexture(depthTex: GPUTextureView) {
        (this._renderPassDescriptor.depthStencilAttachment as GPURenderPassDepthStencilAttachment).view = depthTex;
    }

    render(pool: RenderResourcePool) {
        
        this.setDepthTexture(pool.depthTextureView);
        const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);

        if (pool.scene.entitiesPerWindingOrder.ccw.length > 0) {
            rpe.setPipeline(this._depthPipelineCCW);
            rpe.setBindGroup(DepthShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ, this._viewProjBindGroupCCW);
            pool.scene.entitiesPerWindingOrder.ccw.forEach(e => e.draw(rpe, this._depthPipelineCCW, this._meshDrawOptions));
        }

        if (pool.scene.entitiesPerWindingOrder.cw.length > 0) {
            rpe.setPipeline(this._depthPipelineCW);
            rpe.setBindGroup(DepthShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ, this._viewProjBindGroupCW);
            pool.scene.entitiesPerWindingOrder.cw.forEach(e => e.draw(rpe, this._depthPipelineCW, this._meshDrawOptions));
        }

        rpe.end();

    }

    free() {
        
    }

}
