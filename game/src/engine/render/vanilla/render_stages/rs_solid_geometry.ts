import { PrincipledBSDFShader } from "../../../../shaders/principled_bsdf/principled_bsdf_shader";
import { Shader } from "../../../../shaders/shader";
import { RenderInitializationResources } from "../render_initialization_resources";
import { RenderResourcePool } from "../render_resource_pool";
import { RenderStage } from "./render_stage";

export class RenderStageSolidGeometry implements RenderStage {

    private _principledShader!: Shader;
    private _pipelineCW!: GPURenderPipeline;
    private _pipelineCCW!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _viewProjBindGroupCW!: GPUBindGroup;
    private _viewProjBindGroupCCW!: GPUBindGroup;

    async initialize(resources: RenderInitializationResources) {

        await new Promise<void>(r => {
            this._principledShader = new PrincipledBSDFShader('rs principled bsdf', () => r());
        });

        this._pipelineCW = await this.createPipeline('cw');
        this._pipelineCCW = await this.createPipeline('ccw');
        this._renderPassDescriptor = this.createRenderPassDescriptor();
        this._viewProjBindGroupCW = this.createViewProjBindGroup('cw', resources.viewProjBuffer);
        this._viewProjBindGroupCCW = this.createViewProjBindGroup('ccw', resources.viewProjBuffer);

    }

    private createPipeline(windingOrder: 'cw' | 'ccw') {
        return device.createRenderPipelineAsync({
            label: `rs solid geometry pipeline`,
            layout: 'auto',
            vertex: {
                module: this._principledShader.module,
                entryPoint: 'vertex',
                buffers: [
                    // position
                    {
                        arrayStride: 3 * 4,
                        attributes: [
                            { shaderLocation: 0, offset: 0, format: 'float32x3' }
                        ]
                    },
                    // uv
                    {
                        arrayStride: 2 * 4,
                        attributes: [
                            { shaderLocation: 1, offset: 0, format: 'float32x2' }
                        ]
                    },
                    // normals
                    {
                        arrayStride: 3 * 4,
                        attributes: [
                            { shaderLocation: 2, offset: 0, format: 'float32x3' }
                        ]
                    },
                    // tangents
                    {
                        arrayStride: 4 * 4,
                        attributes: [
                            { shaderLocation: 3, offset: 0, format: 'float32x4' }
                        ]
                    }
                ] as GPUVertexBufferLayout[]
            },
            fragment: {
                module: this._principledShader.module,
                entryPoint: 'fragment',
                targets: [
                    { format: 'rgba16float' as GPUTextureFormat }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
                frontFace: windingOrder
            },
            depthStencil: {
                depthWriteEnabled: false,
                depthCompare: 'equal',
                format: 'depth24plus'
            }
        });
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [
                {
                    // view: undefined, Assigned later
                    // resolveTarget: undefined, Assigned Later
                    clearValue: { r: 0.3, g: 0.3, b: 0.3, a: 1 },
                    loadOp: 'clear',
                    storeOp: 'store'
                }
            ] as GPURenderPassColorAttachment[],
            depthStencilAttachment: {
                // view: undefined, Assigned later
                depthReadOnly: true
            } as GPURenderPassDepthStencilAttachment
        } as GPURenderPassDescriptor;
    }

    private createViewProjBindGroup(windingOrder: 'cw' | 'ccw', buffer: GPUBuffer) {
        const pipeline = windingOrder === 'ccw' ? this._pipelineCCW : this._pipelineCW;
        return device.createBindGroup({
            label: 'PBR ViewProj',
            layout: pipeline.getBindGroupLayout(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: buffer }}
            ]
        });
    }

    private setDepthTexture(depthTex: GPUTextureView) {
        (this._renderPassDescriptor.depthStencilAttachment as GPURenderPassDepthStencilAttachment).view = depthTex;
    }

    private setColorTexture(colorTex: GPUTextureView) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = colorTex;
    }

    render(pool: RenderResourcePool) {

        this.setDepthTexture(pool.depthTextureView);
        this.setColorTexture(pool.hdrTextureView);
        const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);

        if (pool.scene.entitiesPerWindingOrder.ccw.length > 0) {
            rpe.setPipeline(this._pipelineCCW);
            rpe.setBindGroup(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ, this._viewProjBindGroupCCW);
            const sceneInfoBindGroup = pool.scene.info.getBindGroup(this._pipelineCCW, PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.FRAGMENT_SCENE_INFO);
            rpe.setBindGroup(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.FRAGMENT_SCENE_INFO, sceneInfoBindGroup);
            pool.scene.entitiesPerWindingOrder.ccw.forEach(e => e.draw(rpe, this._pipelineCCW));
        }

        if (pool.scene.entitiesPerWindingOrder.cw.length > 0) {
            rpe.setPipeline(this._pipelineCW);
            rpe.setBindGroup(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ, this._viewProjBindGroupCW);
            const sceneInfoBindGroup = pool.scene.info.getBindGroup(this._pipelineCW, PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.FRAGMENT_SCENE_INFO);
            rpe.setBindGroup(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.FRAGMENT_SCENE_INFO, sceneInfoBindGroup);
            pool.scene.entitiesPerWindingOrder.cw.forEach(e => e.draw(rpe, this._pipelineCW));
        }

        rpe.end();
    }

    free() {
        
    }
    
}
