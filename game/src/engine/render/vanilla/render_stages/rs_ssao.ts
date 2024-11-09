import { Float16Array } from '@petamoriken/float16';
import { SSAOBlurShader } from '../../../../shaders/post/ssao/ssao_blur_shader';
import { SSAOShader } from '../../../../shaders/post/ssao/ssao_shader';
import { Shader } from '../../../../shaders/shader';
import { BufferUtils } from '../../../../utils/buffer_utils';
import { MathUtils } from '../../../../utils/math_utils';
import { Mat4 } from '../../../data/mat/mat4';
import { Vec2 } from '../../../data/vec/vec2';
import { Vec3 } from '../../../data/vec/vec3';
import { RenderInitializationResources } from '../render_initialization_resources';
import { RenderResourcePool } from '../render_resource_pool';
import { RenderStage } from './render_stage';

export class RenderStageSSAO implements RenderStage {
    private readonly _bias = 0.0025;
    private readonly _kernelSize = 64;
    private readonly _kernelRadius = 1.0;
    private _kernel: Vec3[] = [];
    private readonly _kernelBuffer = BufferUtils.createEmptyBuffer(
        4 + 4 + (Vec3.byteSize + 4) * this._kernelSize,
        GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
    );

    private _noise: Vec2[] = [];
    private _noiseTexture!: GPUTexture;
    private readonly _samplerRepeat = device.createSampler({
        addressModeU: 'repeat',
        addressModeV: 'repeat',
        minFilter: 'nearest',
        magFilter: 'nearest',
    });
    private readonly _samplerClamp = device.createSampler({
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
        minFilter: 'linear',
        magFilter: 'linear',
    });

    private _ssaoShader!: SSAOShader;
    private _ssaoPipeline!: GPURenderPipeline;
    private readonly _ssaoOptionsBuffer = BufferUtils.createEmptyBuffer(
        2 * Mat4.byteSize + 4,
        GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
    );
    private _ssaoOptKernelBindGroup!: GPUBindGroup;

    private _ssaoBlurShader!: SSAOBlurShader;
    private _ssaoBlurPipeline!: GPURenderPipeline;

    private _ssaoRenderPassDescriptor!: GPURenderPassDescriptor;
    private _ssaoBlurRenderPassDescriptor!: GPURenderPassDescriptor;

    async initialize(resources: RenderInitializationResources) {
        this.buildKernel();
        this.writeKernelBuffer();
        await this.buildNoiseMap();

        await new Promise<void>(r => {
            this._ssaoShader = new SSAOShader('ssao shader', () => r());
        });

        await new Promise<void>(r => {
            this._ssaoBlurShader = new SSAOBlurShader('ssao blur shader', () => r());
        });

        this._ssaoPipeline = await this.createSSAOPipeline(this._ssaoShader);
        this._ssaoBlurPipeline = await this.createSSAOPipeline(this._ssaoBlurShader);
        this._ssaoOptKernelBindGroup = this.createSSAOOptKernelBindGroup();

        this._ssaoRenderPassDescriptor = this.createRenderPassDescriptor();
        this._ssaoBlurRenderPassDescriptor = this.createRenderPassDescriptor();
    }

    private buildKernel() {
        this._kernel = [];

        for (let i = 0; i < this._kernelSize; i++) {
            // X and Y between -1.0 and 1.0 and Z between 0.0 and 1.0 to create a hemisphere
            // Math.random() already returns a float between 0.0 and 1.0
            const sample = new Vec3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random()).normalize();

            sample.multiplyFactor(Math.random());

            // Get more samples closer to the origin
            let scale = i / this._kernelSize;
            scale = MathUtils.lerp(0.1, 1.0, scale * scale);
            sample.multiplyFactor(scale);

            this._kernel.push(sample);
        }
    }

    private writeKernelBuffer() {
        /*
            Kernel buffer will look like this:

                0   4   8   B   F
            000 ▒▒▒▒░░░░--------   [u32 "kernel size" (4 bytes)] + [f32 "kernel radius" (4 bytes)] + [padding (8 bytes)]
            010 ░  sample  ░----   [vec3f "sample 0" (12 bytes)] + [padding (4 bytes)]
            020 ░  sample  ░----   [vec3f "sample 1" (12 bytes)] + [padding (4 bytes)]
            030 ░  sample  ░----   [vec3f "sample 2" (12 bytes)] + [padding (4 bytes)]
            ...
            400 ░  sample  ░----   [vec3f "sample 63" (12 bytes)] + [padding (4 bytes)]

            -: padding
            ░: f32
            ▒: u32
        */
        device.queue.writeBuffer(this._kernelBuffer, 0, new Uint32Array([this._kernelSize]));
        device.queue.writeBuffer(this._kernelBuffer, 4, new Float32Array([this._kernelRadius]));
        const paddedKernel = this._kernel.flatMap(s => [s.x, s.y, s.z, 0]); // extra 0 for padding
        device.queue.writeBuffer(this._kernelBuffer, 0x10, new Float32Array(paddedKernel));
    }

    private writeOptionsBuffer(pool: RenderResourcePool) {
        /*
            Options buffer will look like this:

                0   4   8   B   F
            000 ░░  proj mat  ░░   [mat4x4f "projection matrix" (64 bytes)]
            040 ░ inv proj mat ░   [mat4x4f "inverse projection matrix" (64 bytes)]
            080 ░░░░░░░░--------   [f32 "bias" (4 bytes)] + [f32 "tan half fov" (4 bytes)] + [padding (8 bytes)]

            -: padding
            ░: f32
        */

        device.queue.writeBuffer(this._ssaoOptionsBuffer, 0x00, pool.projectionMatrix.asF32Array);
        device.queue.writeBuffer(this._ssaoOptionsBuffer, 1 * Mat4.byteSize, pool.inverseProjectionMatrix.asF32Array);
        device.queue.writeBuffer(this._ssaoOptionsBuffer, 2 * Mat4.byteSize, new Float32Array([this._bias]));
    }

    private async buildNoiseMap() {
        this._noise = [];
        this._noiseTexture?.destroy();

        // 16 as the noise will be a 4x4 texture
        for (let i = 0; i < 16; i++) {
            const noise = new Vec2(Math.random() * 2 - 1, Math.random() * 2 - 1);
            this._noise.push(noise);
        }

        // build noise texture
        this._noiseTexture = device.createTexture({
            size: [4, 4],
            format: 'rg16float',
            usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
        });

        const noiseF16 = new Float16Array(this._noise.flatMap(v => [v.x, v.y]));

        device.queue.writeTexture(
            { texture: this._noiseTexture },
            noiseF16.buffer,
            { bytesPerRow: 16, rowsPerImage: 4 },
            { width: 4, height: 4 },
        );

        await device.queue.onSubmittedWorkDone();
    }

    private createSSAOPipeline(shader: Shader) {
        return device.createRenderPipelineAsync({
            label: `rs ssao pipeline`,
            layout: 'auto',
            vertex: {
                module: shader.module,
                entryPoint: 'vertex',
                buffers: [],
            },
            fragment: {
                module: shader.module,
                entryPoint: 'fragment',
                targets: [{ format: 'r16float' as GPUTextureFormat }],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
            },
        });
    }

    private createSSAOOptKernelBindGroup() {
        return device.createBindGroup({
            label: 'ssao opt and kernel bind group',
            layout: this._ssaoPipeline.getBindGroupLayout(SSAOShader.BINDING_GROUPS.OPT_KERNEL),
            entries: [
                { binding: 0, resource: { buffer: this._ssaoOptionsBuffer } },
                { binding: 1, resource: { buffer: this._kernelBuffer } },
            ],
        });
    }

    private createSSAOTexturesBindGroup(pool: RenderResourcePool) {
        return device.createBindGroup({
            label: 'ssao textures bind group',
            layout: this._ssaoPipeline.getBindGroupLayout(SSAOShader.BINDING_GROUPS.TEXTURES),
            entries: [
                { binding: 0, resource: this._samplerRepeat },
                { binding: 1, resource: this._samplerClamp },
                { binding: 2, resource: this._noiseTexture.createView() },
                { binding: 3, resource: pool.depthTextureView },
                { binding: 4, resource: pool.normalTextureView },
            ],
        });
    }

    private createSSAOBlurBindGroup(pool: RenderResourcePool) {
        return device.createBindGroup({
            label: 'ssao blur textures bind group',
            layout: this._ssaoBlurPipeline.getBindGroupLayout(SSAOBlurShader.BINDING_GROUPS.TEXTURES),
            entries: [
                { binding: 0, resource: this._samplerClamp },
                { binding: 1, resource: pool.ssaoTextureNoisy.texture.createView() },
            ],
        });
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [
                {
                    // view: undefined, Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    loadOp: 'load',
                    storeOp: 'store',
                },
            ] as GPURenderPassColorAttachment[],
        } as GPURenderPassDescriptor;
    }

    private setSSAORenderTexture(texView: GPUTextureView) {
        (this._ssaoRenderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = texView;
    }

    private setSSAOBlurRenderTexture(tex: GPUTexture) {
        (this._ssaoBlurRenderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view =
            tex.createView();
    }

    private renderSSAO(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('SSAO Renderer - SSAO');

        this.writeOptionsBuffer(pool);
        const texturesBindGroup = this.createSSAOTexturesBindGroup(pool);

        this.setSSAORenderTexture(pool.ssaoTextureViewNoisy);
        const rpe = pool.commandEncoder.beginRenderPass(this._ssaoRenderPassDescriptor);

        rpe.setPipeline(this._ssaoPipeline);
        rpe.setBindGroup(SSAOShader.BINDING_GROUPS.OPT_KERNEL, this._ssaoOptKernelBindGroup);
        rpe.setBindGroup(SSAOShader.BINDING_GROUPS.TEXTURES, texturesBindGroup);
        rpe.draw(6);
        rpe.end();

        pool.commandEncoder.popDebugGroup();
    }

    private blurSSAO(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('SSAO Renderer - Blur');

        const texturesBindGroup = this.createSSAOBlurBindGroup(pool);

        this.setSSAOBlurRenderTexture(pool.ssaoTextureBlurred.texture);
        const rpe = pool.commandEncoder.beginRenderPass(this._ssaoBlurRenderPassDescriptor);

        rpe.setPipeline(this._ssaoBlurPipeline);
        rpe.setBindGroup(SSAOBlurShader.BINDING_GROUPS.TEXTURES, texturesBindGroup);
        rpe.draw(6);
        rpe.end();

        pool.commandEncoder.popDebugGroup();
    }

    render(pool: RenderResourcePool) {
        pool.commandEncoder.pushDebugGroup('SSAO Renderer');
        this.renderSSAO(pool);
        this.blurSSAO(pool);
        pool.commandEncoder.popDebugGroup();
    }

    free() {
        this._noiseTexture?.destroy();
    }
}
