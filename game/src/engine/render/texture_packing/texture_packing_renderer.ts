import { Shader } from "../../../shaders/shader";
import { TexturePackerVec3f32Shader } from "../../../shaders/util/texture_packer/texture_packer_vec3_f32_shader";
import { TexturePackerVec4Shader } from "../../../shaders/util/texture_packer/texture_packer_vec4_shader";
import { Texture } from "../../data/texture/texture";
import { Vec2 } from "../../data/vec/vec2";

export class TexturePackingRenderer {

    private _shaderVec4!: TexturePackerVec4Shader;
    private _shaderVec3f32!: TexturePackerVec3f32Shader;

    private _pipelineVec4!: GPURenderPipeline;
    private _pipelineVec3f32!: GPURenderPipeline;

    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _sampler = device.createSampler({
        label: 'texture packing sampler',
        magFilter: 'linear',
        minFilter: 'linear'
    });

    async initialize() {

        await new Promise<void>(res => {
            this._shaderVec4 = new TexturePackerVec4Shader('Texture Packer Vec4 Shader', () => res());
        });

        await new Promise<void>(res => {
            this._shaderVec3f32 = new TexturePackerVec3f32Shader('Texture Packer Vec3 f32 Shader', () => res());
        });

        this._pipelineVec4 = await this.createPipeline(this._shaderVec4);
        this._pipelineVec3f32 = await this.createPipeline(this._shaderVec3f32);

        this._renderPassDescriptor = this.createRenderPassDescriptor();

    }

    private createPipeline(shader: Shader) {
        return device.createRenderPipelineAsync({
            label: 'mipmap pipeline',
            layout: 'auto',
            vertex: {
                module: shader.module,
                entryPoint: 'vertex'
            },
            fragment: {
                module: shader.module,
                entryPoint: 'fragment',
                targets: [
                    { format: 'rgba8unorm' as GPUTextureFormat }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none'
            }
        });
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [
                {
                    // view: Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    loadOp: 'clear',
                    storeOp: 'store'
                } as GPURenderPassColorAttachment
            ]
        } as GPURenderPassDescriptor;
    }

    private setRenderTargetView(view: GPUTextureView) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = view;
    }

    private getMaximumTextureDimensions(textures: Texture[]) {
        let width = 1;
        let height = 1;
        textures.forEach(tex => {
            width = Math.max(width, tex.texture.width);
            height = Math.max(height, tex.texture.height);
        });
        return new Vec2(width, height);
    }

    private createTargetTexture(sources: Texture[], format: GPUTextureFormat) {
        const resolution = this.getMaximumTextureDimensions(sources);
        const targetGPUTex = device.createTexture({
            size: [resolution.x, resolution.y],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        return new Texture(targetGPUTex);
    }

    async pack_4r_rgba8unorm(r: Texture, g: Texture, b: Texture, a: Texture) {
        const targetTex = this.createTargetTexture([r, g, b, a], 'rgba8unorm');
        const sourceBindings = device.createBindGroup({
            layout: this._pipelineVec4.getBindGroupLayout(TexturePackerVec4Shader.BINDING_GROUPS.TEXTURE),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: r.view },
                { binding: 2, resource: g.view },
                { binding: 3, resource: b.view },
                { binding: 4, resource: a.view }
            ]
        });
        await this.packTexture(sourceBindings, this._pipelineVec4, targetTex);
        return targetTex;
    }

    async pack_1rgb1a_rgba8unorm(rgb: Texture, a: Texture) {
        const targetTex = this.createTargetTexture([rgb, a], 'rgba8unorm');
        const sourceBindings = device.createBindGroup({
            layout: this._pipelineVec3f32.getBindGroupLayout(TexturePackerVec3f32Shader.BINDING_GROUPS.TEXTURE),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: rgb.view },
                { binding: 2, resource: a.view }
            ]
        });
        await this.packTexture(sourceBindings, this._pipelineVec3f32, targetTex);
        return targetTex;
    }

    private async packTexture(sourceBindGroup: GPUBindGroup, pipeline: GPURenderPipeline, target: Texture) {
        const commandEncoder = device.createCommandEncoder();
        this.setRenderTargetView(target.view);
        const rpe = commandEncoder.beginRenderPass(this._renderPassDescriptor);
        rpe.setPipeline(pipeline);
        rpe.setBindGroup(0, sourceBindGroup);
        rpe.draw(6);
        rpe.end();
        device.queue.submit([commandEncoder.finish()]);
        await device.queue.onSubmittedWorkDone();
    }

    free() {
    }

}