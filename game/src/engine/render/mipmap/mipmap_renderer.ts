import { InvalidArgumentError } from "../../../errors/engine/internal/invalid_argument";
import { Shader } from "../../../shaders/shader";
import { Mipmap2DShader } from "../../../shaders/util/mipmap/mipmap_2d_shader";
import { MipmapCubeShader } from "../../../shaders/util/mipmap/mipmap_cube_shader";
import { BufferUtils } from "../../../utils/buffer_utils";
import { MathUtils } from "../../../utils/math_utils";
import { Mat4 } from "../../data/mat/mat4";
import { Vec3 } from "../../data/vec/vec3";

export class MipmapRenderer {
    
    private _2dShader!: Mipmap2DShader;
    private _cubeShader!: MipmapCubeShader;

    private _2dPipeline!: GPURenderPipeline;
    private _cubePipeline!: GPURenderPipeline;

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

    private _cubeMatrixBindGroup!: GPUBindGroup;
    private _sampler = device.createSampler({
        label: 'cubemap convolution sampler',
        magFilter: 'linear',
        minFilter: 'linear',
        mipmapFilter: 'linear'
    });

    async initialize() {

        await new Promise<void>(r => {
            this._2dShader = new Mipmap2DShader('2d mipmap shader', () => r());
        });

        await new Promise<void>(r => {
            this._cubeShader = new MipmapCubeShader('2d mipmap shader', () => r());
        });

        this._2dPipeline = this.createPipeline(this._2dShader);
        this._cubePipeline = this.createPipeline(this._cubeShader);

        this._renderPassDescriptor = this.createRenderPassDescriptor();

        // write projection matrix to buffer as it won't change
        device.queue.writeBuffer(this._uniformBuffer, Mat4.byteSize, this._projectionMat.asF32Array);

        this._cubeMatrixBindGroup = this.createCubeMatrixBindGroup();
    }

    private createPipeline(shader: Shader) {
        return device.createRenderPipeline({
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
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    loadOp: 'clear',
                    storeOp: 'store'
                } as GPURenderPassColorAttachment
            ]
        } as GPURenderPassDescriptor;
    }

    private createCubeMatrixBindGroup() {
        return device.createBindGroup({
            label: 'cubemap convolution matrix bindgroup',
            layout: this._cubePipeline.getBindGroupLayout(MipmapCubeShader.BINDING_GROUPS.VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: this._uniformBuffer }}
            ]
        });
    }

    private setRenderTargetView(view: GPUTextureView) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = view;
    }

    async generateMipMaps2D(source: GPUTexture) {

        if (source.depthOrArrayLayers !== 1) throw new InvalidArgumentError(`Trying to generate mipmaps for a supposedly 2D texture with ${source.depthOrArrayLayers} layers (should be 1)`);
        
        for (let mip = 1; mip < source.mipLevelCount; mip++) {

            const passSource = source.createView({
                baseMipLevel: mip - 1,
                mipLevelCount: 1
            });

            const renderTarget = source.createView({
                baseMipLevel: mip,
                mipLevelCount: 1
            });

            const texBindGroup = device.createBindGroup({
                label: '2d mipmap texture bind group',
                layout: this._2dPipeline.getBindGroupLayout(Mipmap2DShader.BINDING_GROUPS.TEXTURE),
                entries: [
                    { binding: 0, resource: this._sampler },
                    { binding: 1, resource: passSource },
                ]
            });

            const commandEncoder = device.createCommandEncoder();
            this.setRenderTargetView(renderTarget);
            const rpe = commandEncoder.beginRenderPass(this._renderPassDescriptor);
            rpe.setPipeline(this._2dPipeline);
            rpe.setBindGroup(Mipmap2DShader.BINDING_GROUPS.TEXTURE, texBindGroup);
            rpe.draw(6);
            rpe.end();

            device.queue.submit([commandEncoder.finish()]);
        }

        await device.queue.onSubmittedWorkDone();

    }

    async generateMipMapsCube(source: GPUTexture) {

        if (source.depthOrArrayLayers !== 6) throw new InvalidArgumentError(`Trying to generate mipmaps for a supposedly cube texture with ${source.depthOrArrayLayers} layers (should be 6)`);
        
        for (let mip = 1; mip < source.mipLevelCount; mip++) {

            const passSource = source.createView({
                baseMipLevel: mip - 1,
                mipLevelCount: 1,
                dimension: 'cube'
            });

            const texBindGroup = device.createBindGroup({
                label: 'cube mipmap texture bind group',
                layout: this._cubePipeline.getBindGroupLayout(MipmapCubeShader.BINDING_GROUPS.TEXTURE),
                entries: [
                    { binding: 0, resource: this._sampler },
                    { binding: 1, resource: passSource },
                ]
            });

            for (let face = 0; face < source.depthOrArrayLayers; face++) {
    
                const renderTarget = source.createView({
                    baseMipLevel: mip,
                    mipLevelCount: 1,
                    baseArrayLayer: face,
                    arrayLayerCount: 1
                });

                const cameraMatrix = this._cameraMatrices[face];
                device.queue.writeBuffer(this._uniformBuffer, 0, cameraMatrix.asF32Array);

                const commandEncoder = device.createCommandEncoder();
                this.setRenderTargetView(renderTarget);
                const rpe = commandEncoder.beginRenderPass(this._renderPassDescriptor);
                rpe.setPipeline(this._cubePipeline);
                rpe.setBindGroup(MipmapCubeShader.BINDING_GROUPS.TEXTURE, texBindGroup);
                rpe.setBindGroup(MipmapCubeShader.BINDING_GROUPS.VIEWPROJ, this._cubeMatrixBindGroup);
                rpe.draw(36);
                rpe.end();

                device.queue.submit([commandEncoder.finish()]);
            }
        }

        await device.queue.onSubmittedWorkDone();

    }

    free() {
        this._uniformBuffer?.destroy();
    }

}