import { BadResolutionError } from "../../../errors/engine/data/bad_resolution";
import { PrefilterCubemapShader } from "../../../shaders/prefilter_cubemap/prefilter_cubemap_shader";
import { BufferUtils } from "../../../utils/buffer_utils";
import { MathUtils } from "../../../utils/math_utils";
import { Mat4 } from "../../data/mat/mat4";
import { Vec3 } from "../../data/vec/vec3";

export class CubemapPrefilterRenderer {

    private _convolutionShader!: PrefilterCubemapShader;
    private _pipeline!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;

    private _projectionMat = Mat4.perspective(MathUtils.degToRad(90), 1, 0.1, 10);
    private _cameraMatrices = [
        Mat4.lookAt(Vec3.zero, new Vec3( 1,  0,  0), new Vec3( 0,  1,  0)), // + X
        Mat4.lookAt(Vec3.zero, new Vec3(-1,  0,  0), new Vec3( 0,  1,  0)), // - X
        Mat4.lookAt(Vec3.zero, new Vec3( 0,  1,  0), new Vec3( 0,  0,  1)), // + Y
        Mat4.lookAt(Vec3.zero, new Vec3( 0, -1,  0), new Vec3( 0,  0, -1)), // - Y
        Mat4.lookAt(Vec3.zero, new Vec3( 0,  0, -1), new Vec3( 0,  1,  0)), // - Z
        Mat4.lookAt(Vec3.zero, new Vec3( 0,  0,  1), new Vec3( 0,  1,  0))  // + Z
    ];
    private _uniformBuffer = BufferUtils.createEmptyBuffer(2 * Mat4.byteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    private _optionsBuffer = BufferUtils.createEmptyBuffer(16, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

    private _matrixBindGroup!: GPUBindGroup;
    private _sampler!: GPUSampler;

    async initialize() {

        await new Promise<void>(r => {
            this._convolutionShader = new PrefilterCubemapShader('cubemap prefilter shader', () => r());
        });

        this._pipeline = this.createPipeline();
        this._sampler = this.createSampler();
        this._renderPassDescriptor = this.createRenderPassDescriptor();

        // write projection matrix to buffer as it won't change
        device.queue.writeBuffer(this._uniformBuffer, Mat4.byteSize, this._projectionMat.asF32Array);

        this._matrixBindGroup = this.createMatrixBindGroup();
    }

    private createPipeline() {
        return device.createRenderPipeline({
            label: 'cubemap convolution pipeline',
            layout: 'auto',
            vertex: {
                module: this._convolutionShader.module,
                entryPoint: 'vertex'
            },
            fragment: {
                module: this._convolutionShader.module,
                entryPoint: 'fragment',
                targets: [
                    { format: 'rgba16float' as GPUTextureFormat }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'front'
            }
        });
    }

    private createRenderPassDescriptor() {
        return {
            colorAttachments: [
                {
                    // view: Assigned later
                    // resolveTarget: Assigned Later
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    loadOp: 'clear',
                    storeOp: 'store'
                } as GPURenderPassColorAttachment
            ]
        } as GPURenderPassDescriptor;
    }

    private createSampler() {
        return device.createSampler({
            label: 'cubemap convolution sampler',
            magFilter: 'linear',
            minFilter: 'linear'
        });
    }

    private createMatrixBindGroup() {
        return device.createBindGroup({
            label: 'cubemap convolution matrix bindgroup',
            layout: this._pipeline.getBindGroupLayout(PrefilterCubemapShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: this._uniformBuffer }}
            ]
        });
    }

    async prefilterCubemap(cubemap: GPUTexture, cubemapResolution = 128, mipLevels = 5) {
        if (cubemapResolution <= 0 || cubemapResolution > device.limits.maxTextureDimension3D) {
            throw new BadResolutionError(`Trying to render a cubemap of resolution ${cubemapResolution}, should be between [1, ${device.limits.maxTextureDimension3D}]`);
        }

        // write cubemap resolution to the buffer (with an offset of 4 bytes as the first 4 bytes are the roughness)
        device.queue.writeBuffer(this._optionsBuffer, 4, new Float32Array([cubemapResolution]));

        // create destination 3d texture
        const renderTarget = device.createTexture({
            label: 'final convoluted cubemap texture',
            format: 'rgba16float',
            dimension: '2d',
            mipLevelCount: mipLevels,
            size: [cubemapResolution, cubemapResolution, 6],
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT
        });

        // create bindgroup to hold the supplied texture
        const texBindGroup = device.createBindGroup({
            label: 'cubemap convolution texture bindgroup',
            layout: this._pipeline.getBindGroupLayout(PrefilterCubemapShader.UNIFORM_BINDING_GROUPS.FRAGMENT_TEXTURE),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: cubemap.createView({ dimension: 'cube' }) },
                { binding: 2, resource: { buffer: this._optionsBuffer }}
            ]
        });

        // render for all 6 sides
        for (let i = 0; i < 6; i++) {

            const cameraMatrix = this._cameraMatrices[i];

            // write view matrix to buffer
            device.queue.writeBuffer(this._uniformBuffer, 0, cameraMatrix.asF32Array);

            // render all mip levels for each face
            for (let mipLevel = 0; mipLevel < mipLevels; mipLevel++) {

                const roughness = mipLevel / (mipLevels - 1);
                // write mip level to the first 4 bytes of the options buffer
                device.queue.writeBuffer(this._optionsBuffer, 0, new Float32Array([roughness]));

                const commandEncoder = device.createCommandEncoder();

                (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = renderTarget.createView({
                    arrayLayerCount: 1,
                    baseArrayLayer: i,
                    mipLevelCount: 1,
                    baseMipLevel: mipLevel
                });

                const passEncoder = commandEncoder.beginRenderPass(this._renderPassDescriptor);
                passEncoder.setPipeline(this._pipeline);

                // bind uniforms
                passEncoder.setBindGroup(PrefilterCubemapShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ, this._matrixBindGroup);
                passEncoder.setBindGroup(PrefilterCubemapShader.UNIFORM_BINDING_GROUPS.FRAGMENT_TEXTURE, texBindGroup);

                // draw to texture
                // will draw 36 vertices, no data needs to be supplied as the vertices are hard coded into the shader
                passEncoder.draw(36);
                passEncoder.end();

                device.queue.submit([commandEncoder.finish()]);
            }
        }

        // wait for all the rendering to be done and return the texture
        await device.queue.onSubmittedWorkDone();
        return renderTarget;
    }

    free() {
        this._uniformBuffer?.destroy();
        this._optionsBuffer?.destroy();
    }
}