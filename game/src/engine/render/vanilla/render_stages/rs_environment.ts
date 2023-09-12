import { EnvironmentShader } from "../../../../shaders/environment/environment_shader";
import { SSAOShader } from "../../../../shaders/ssao/ssao_shader";
import { BufferUtils } from "../../../../utils/buffer_utils";
import { Mat4 } from "../../../data/mat/mat4";
import { RenderInitializationResources } from "../render_initialization_resources";
import { RenderResourcePool } from "../render_resource_pool";
import { RenderStage } from "./render_stage";

export class RenderStageEnvironment implements RenderStage {

    private _shader!: SSAOShader;
    private _pipeline!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _sampler = device.createSampler();

    private _variablesBuffer = BufferUtils.createEmptyBuffer(2 * Mat4.byteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    private _variablesBindGroup!: GPUBindGroup;

    async initialize(resources: RenderInitializationResources) {

        await new Promise<void>(r => {
            this._shader = new EnvironmentShader('environment shader', () => r());
        });

        this._pipeline = await this.createPipeline(resources.hdrTextureFormat);
        this._renderPassDescriptor = this.createRenderPassDescriptor();
        this._variablesBindGroup = this.createVariablesBindGroup();
    }

    private createPipeline(hdrFormat: GPUTextureFormat) {
        return device.createRenderPipelineAsync({
            label: `rs ssao pipeline`,
            layout: 'auto',
            vertex: {
                module: this._shader.module,
                entryPoint: 'vertex',
                buffers: []
            },
            fragment: {
                module: this._shader.module,
                entryPoint: 'fragment',
                targets: [
                    { 
                        format: hdrFormat, 
                        blend: {
                            color: {
                                operation: 'add',
                                srcFactor: 'one',
                                dstFactor: 'one'
                            },
                            alpha: {
                                operation: 'max',
                                srcFactor: 'one',
                                dstFactor: 'one'
                            }
                        }
                    } as GPUColorTargetState
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none'
            }
        })
    }

    private createVariablesBindGroup() {
        return device.createBindGroup({
            label: 'environment variables bind group',
            layout: this._pipeline.getBindGroupLayout(EnvironmentShader.BINDING_GROUPS.VARIABLES),
            entries: [
                { binding: 0, resource: { buffer: this._variablesBuffer }}
            ]
        });
    }

    private createTexturesBindGroup(pool: RenderResourcePool) {
        return device.createBindGroup({
            label: 'environment textures bind group',
            layout: this._pipeline.getBindGroupLayout(EnvironmentShader.BINDING_GROUPS.TEXTURES),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: pool.depthTextureView },
                { binding: 2, resource: pool.normalTextureView },
                { binding: 3, resource: pool.specularTextureView },
                { binding: 4, resource: pool.ssaoTextureViewBlurred },
            ]
        })
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

    private setRenderTexture(texView: GPUTextureView) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = texView;
    }

    private updateVariablesBuffer(pool: RenderResourcePool) {
        device.queue.writeBuffer(this._variablesBuffer, 0, pool.projectionMatrix.asF32Array);
        device.queue.writeBuffer(this._variablesBuffer, Mat4.byteSize, pool.inverseProjectionMatrix.asF32Array);
    }

    render(pool: RenderResourcePool) {
        
        pool.commandEncoder.pushDebugGroup('Environment Renderer');
        
        const texturesBindGroup = this.createTexturesBindGroup(pool);
        this.updateVariablesBuffer(pool);
        this.setRenderTexture(pool.hdrTextureView);
        const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);

        rpe.setPipeline(this._pipeline);
        rpe.setBindGroup(EnvironmentShader.BINDING_GROUPS.SCENE, pool.scene.info.getBindGroup(this._pipeline, {
            layoutIndex: EnvironmentShader.BINDING_GROUPS.SCENE,
            directionalLights: false,
            sampler: true,
            skyboxConvoluted: true,
            skyboxPrefiltered: true,
            brdfLUT: true
        }));
        rpe.setBindGroup(EnvironmentShader.BINDING_GROUPS.TEXTURES, texturesBindGroup);
        rpe.setBindGroup(EnvironmentShader.BINDING_GROUPS.VARIABLES, this._variablesBindGroup);
        rpe.draw(6);
        rpe.end();

        pool.commandEncoder.popDebugGroup();

    }

    free() {
        this._variablesBuffer?.destroy();
    }

}
