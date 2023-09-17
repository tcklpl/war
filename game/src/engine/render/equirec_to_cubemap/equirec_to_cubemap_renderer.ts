import { BadResolutionError } from "../../../errors/engine/data/bad_resolution";
import { EquirectangularShader } from "../../../shaders/equirectangular/equirectangular_shader";
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
            layout: pipeline.getBindGroupLayout(EquirectangularShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: this._uniformBuffer }}
            ]
        });
    }

    async renderEquirectangularMapToCubemap(equirecImage: GPUTexture, texType: 'rgba16float' | 'rgba32float', cubemapResolution = 512) {
        if (cubemapResolution <= 0 || cubemapResolution > device.limits.maxTextureDimension3D) {
            throw new BadResolutionError(`Trying to render an equirectangular texture to a cubemap of resolution ${cubemapResolution}, should be between [1, ${device.limits.maxTextureDimension3D}]`);
        }

        // create destination 3d texture
        const finalCubemap = device.createTexture({
            label: 'final cubemap texture',
            format: 'rgba16float',
            dimension: '2d',
            size: [cubemapResolution, cubemapResolution, 6],
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT
        });

        const pipeline = texType === 'rgba16float' ? this._pipeline16f : this._pipeline32f;
        const matrixBindGroup = texType === 'rgba16float' ? this._matrixBindGroup16f : this._matrixBindGroup32f;

        // create bindgroup to hold the supplied texture
        const texBindGroup = device.createBindGroup({
            label: 'equirec to cubemap conversion texture bindgroup',
            layout: pipeline.getBindGroupLayout(EquirectangularShader.UNIFORM_BINDING_GROUPS.FRAGMENT_TEXTURE),
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
                baseArrayLayer: i
            });

            const passEncoder = commandEncoder.beginRenderPass(this._renderPassDescriptor);

            passEncoder.setPipeline(pipeline);

            // bind uniforms
            passEncoder.setBindGroup(EquirectangularShader.UNIFORM_BINDING_GROUPS.VERTEX_VIEWPROJ, matrixBindGroup);
            passEncoder.setBindGroup(EquirectangularShader.UNIFORM_BINDING_GROUPS.FRAGMENT_TEXTURE, texBindGroup);

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