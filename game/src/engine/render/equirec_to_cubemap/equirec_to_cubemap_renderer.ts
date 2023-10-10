import { BadResolutionError } from "../../../errors/engine/data/bad_resolution";
import { EquirectangularShader } from "../../../shaders/util/equirectangular/equirectangular_shader";
import { BufferUtils } from "../../../utils/buffer_utils";
import { MathUtils } from "../../../utils/math_utils";
import { Mat4 } from "../../data/mat/mat4";
import { Vec3 } from "../../data/vec/vec3";

export class EquirectangularToCubemapRenderer {

    private _equirecShader!: EquirectangularShader;
    private _pipeline16f!: GPURenderPipeline;
    private _pipeline32f!: GPURenderPipeline;
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

    private _matrixBindGroup16f!: GPUBindGroup;
    private _matrixBindGroup32f!: GPUBindGroup;
    private _sampler!: GPUSampler;

    async initialize() {

        await new Promise<void>(r => {
            this._equirecShader = new EquirectangularShader('equirec to cubemap shader', () => r());
        });

        this._pipeline16f = await this.createPipeline('rgba16float');
        this._pipeline32f = await this.createPipeline('rgba32float');
        this._sampler = this.createSampler();
        this._renderPassDescriptor = this.createRenderPassDescriptor();

        // write projection matrix to buffer as it won't change
        device.queue.writeBuffer(this._uniformBuffer, Mat4.byteSize, this._projectionMat.asF32Array);

        this._matrixBindGroup16f = this.createMatrixBindGroup(this._pipeline16f);
        this._matrixBindGroup32f = this.createMatrixBindGroup(this._pipeline32f);
    }

    private createPipeline(texType: 'rgba16float' | 'rgba32float') {
        return device.createRenderPipelineAsync({
            label: 'equirec to cubemap pipeline',
            layout: texType === 'rgba16float' ? 'auto' : device.createPipelineLayout({
                label: 'equirec to cubemap pipeline layout',
                bindGroupLayouts: [
                    device.createBindGroupLayout({
                        entries: [
                            {
                                binding: 0,
                                buffer: { type: 'uniform' },
                                visibility: GPUShaderStage.VERTEX
                            }
                        ] as GPUBindGroupLayoutEntry[]
                    }),
                    device.createBindGroupLayout({
                        entries: [
                            {
                                binding: 0,
                                sampler: { type: 'non-filtering' },
                                visibility: GPUShaderStage.FRAGMENT
                            },
                            {
                                binding: 1,
                                texture: { sampleType: 'unfilterable-float' },
                                visibility: GPUShaderStage.FRAGMENT
                            }
                        ] as GPUBindGroupLayoutEntry[]
                    })
                ]
            }),
            vertex: {
                module: this._equirecShader.module,
                entryPoint: 'vertex'
            },
            fragment: {
                module: this._equirecShader.module,
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
            label: 'equirec to cubemap sampler'
        });
    }

    private createMatrixBindGroup(pipeline: GPURenderPipeline) {
        return device.createBindGroup({
            label: 'equirec to cubemap matrix bindgroup',
            layout: pipeline.getBindGroupLayout(EquirectangularShader.BINDING_GROUPS.VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: this._uniformBuffer }}
            ]
        });
    }

    async renderEquirectangularMapToCubemap(equirecImage: GPUTexture, options: {
        cubemapResolution: number,
        mipCount: number
    }) {
        if (options.cubemapResolution <= 0 || options.cubemapResolution > device.limits.maxTextureDimension3D) {
            throw new BadResolutionError(`Trying to render an equirectangular texture to a cubemap of resolution ${options.cubemapResolution}, should be between [1, ${device.limits.maxTextureDimension3D}]`);
        }

        // create destination 3d texture
        const finalCubemap = device.createTexture({
            label: 'final cubemap texture',
            format: 'rgba16float',
            dimension: '2d',
            size: [options.cubemapResolution, options.cubemapResolution, 6],
            mipLevelCount: options.mipCount,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT
        });

        /*
            Select which pipeline and bind group are going to be used.
            We cannot use the same one as 'rgba32float' is an 'unfilterable-float' texture and its layout has to be
            explicitly defined, whereas we can just use 'auto' for filterable textures.
        */
        const pipeline = equirecImage.format === 'rgba32float' ? this._pipeline32f : this._pipeline16f;
        const matrixBindGroup = equirecImage.format === 'rgba32float' ? this._matrixBindGroup32f : this._matrixBindGroup16f;

        // create bindgroup to hold the supplied texture
        const texBindGroup = device.createBindGroup({
            label: 'equirec to cubemap conversion texture bindgroup',
            layout: pipeline.getBindGroupLayout(EquirectangularShader.BINDING_GROUPS.TEXTURE),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: equirecImage.createView() },
            ]
        });

        // render for all 6 sides
        for (let i = 0; i < 6; i++) {

            const cameraMatrix = this._cameraMatrices[i];

            // write view matrix to buffer
            device.queue.writeBuffer(this._uniformBuffer, 0, cameraMatrix.asF32Array);

            const commandEncoder = device.createCommandEncoder();

            (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = finalCubemap.createView({
                arrayLayerCount: 1,
                baseArrayLayer: i,
                baseMipLevel: 0,
                mipLevelCount: 1
            });

            const passEncoder = commandEncoder.beginRenderPass(this._renderPassDescriptor);

            passEncoder.setPipeline(pipeline);

            // bind uniforms
            passEncoder.setBindGroup(EquirectangularShader.BINDING_GROUPS.VIEWPROJ, matrixBindGroup);
            passEncoder.setBindGroup(EquirectangularShader.BINDING_GROUPS.TEXTURE, texBindGroup);

            // draw to texture
            // will draw 36 vertices, no data needs to be supplied as the vertices are hard coded into the shader
            passEncoder.draw(36);
            passEncoder.end();

            device.queue.submit([commandEncoder.finish()]);
        }
        
        // wait for all the rendering to be done and return the texture
        await device.queue.onSubmittedWorkDone();
        return finalCubemap;
    }

    free() {
        this._uniformBuffer?.destroy();
    }
}