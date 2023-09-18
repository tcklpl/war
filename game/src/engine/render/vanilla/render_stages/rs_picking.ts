import { PickingShader } from "../../../../shaders/picking/picking_shader";
import { BufferUtils } from "../../../../utils/buffer_utils";
import { MathUtils } from "../../../../utils/math_utils";
import { Mat4 } from "../../../data/mat/mat4";
import { PrimitiveDrawOptions } from "../../../data/meshes/primitive_draw_options";
import { Texture } from "../../../data/texture/texture";
import { Vec2 } from "../../../data/vec/vec2";
import { Resolution } from "../../../resolution";
import { RenderInitializationResources } from "../render_initialization_resources";
import { RenderResourcePool } from "../render_resource_pool";
import { RenderStage } from "./render_stage";

export class RenderStagePicking implements RenderStage {

    private _shader!: PickingShader;
    private _pickingTexture = new Texture();
    private _pickingProjectionMatrix!: Mat4;
    private _pickingPipeline!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;
    private _meshDrawOptions = new PrimitiveDrawOptions().includePosition(0);

    private _viewProjBuffer = BufferUtils.createEmptyBuffer(2 * Mat4.byteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    private _viewProjBindGroup!: GPUBindGroup;

    private _pickingBuffer!: GPUBuffer; // this is just a reference, the buffer is inside vanilla_renderer

    async initialize(resources: RenderInitializationResources) {
        
        await new Promise<void>(r => {
            this._shader = new PickingShader('picking shader', () => r());
        });

        this._pickingTexture.texture = device.createTexture({
            size: [1, 1],
            format: 'r32uint',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        });

        this._pickingPipeline = await this.createPickingPipeline();
        this._renderPassDescriptor = this.createRenderPassDescriptor();
        this._viewProjBindGroup = this.createViewProjBindGroup();
        this._pickingBuffer = resources.pickingBuffer;
    }

    private createPickingPipeline() {
        return device.createRenderPipelineAsync({
            label: `rs picking pipeline`,
            layout: 'auto',
            vertex: {
                module: this._shader.module,
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
                module: this._shader.module,
                entryPoint: 'fragment',
                targets: [
                    { format: 'r32uint' as GPUTextureFormat }
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
                // ID Output
                {
                    // view: undefined, Assigned later
                    clearValue: { r: 0, g: 0, b: 0, a: 0 },
                    loadOp: 'clear',
                    storeOp: 'store'
                },
            ] as GPURenderPassColorAttachment[]
        } as GPURenderPassDescriptor;
    }

    private createViewProjBindGroup() {
        const pipeline = this._pickingPipeline;
        return device.createBindGroup({
            label: 'Picking ViewProj',
            layout: pipeline.getBindGroupLayout(PickingShader.BINDING_GROUPS.VIEWPROJ),
            entries: [
                { binding: 0, resource: { buffer: this._viewProjBuffer }}
            ]
        });
    }

    private updatePickingProjectionMatrix(resolution: Resolution, mouse: Vec2, fovY: number, near: number, far: number) {
        const screenWidth = resolution.full.x;
        const screenHeight = resolution.full.y;
        const aspect = resolution.aspectRatio;
        const top = Math.tan(MathUtils.degToRad(fovY) * 0.5) * near;
        const bottom = -top;
        const left = aspect * bottom;
        const right = aspect * top;
        const width = Math.abs(right - left);
        const height = Math.abs(top - bottom);

        const pixelX = mouse.x;
        const pixelY = screenHeight - mouse.y - 1;

        const subLeft = left + pixelX * width / screenWidth;
        const subBottom = bottom + pixelY * height / screenHeight;
        const subWidth = width / screenWidth;
        const subHeight = height / screenHeight;

        this._pickingProjectionMatrix = Mat4.frustum(subLeft, subLeft + subWidth, subBottom, subBottom + subHeight, near, far);
    }

    private updateViewProjBuffer(view: Mat4) {
        device.queue.writeBuffer(this._viewProjBuffer, 0, view.asF32Array);
        device.queue.writeBuffer(this._viewProjBuffer, Mat4.byteSize, this._pickingProjectionMatrix.asF32Array);
    }

    private setColorAttachment(view: GPUTextureView) {
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = view;
    }

    render(pool: RenderResourcePool) {

        const camera = pool.scene.activeCamera;
        if (!camera) return;
        
        pool.commandEncoder.pushDebugGroup('Picking Renderer');
        this.updatePickingProjectionMatrix(pool.resolution, game.engine.managers.io.mouse.position, pool.renderProjection.fovY, pool.renderProjection.near, pool.renderProjection.far);
        this.updateViewProjBuffer(camera.viewMatrix);

        this.setColorAttachment(this._pickingTexture.view);
        const rpe = pool.commandEncoder.beginRenderPass(this._renderPassDescriptor);

        rpe.setPipeline(this._pickingPipeline);
        rpe.setBindGroup(PickingShader.BINDING_GROUPS.VIEWPROJ, this._viewProjBindGroup);
        pool.scene.entitiesToRender.forEach(e => e.draw(rpe, this._pickingPipeline, this._meshDrawOptions));

        rpe.end();
        pool.commandEncoder.copyTextureToBuffer(
            { texture: this._pickingTexture.texture }, 
            { buffer: this._pickingBuffer }, 
            { width: 1, height: 1 }
        );

        pool.commandEncoder.popDebugGroup();
    }

    free() {
        this._pickingTexture.free();
        this._viewProjBuffer?.destroy();
    }

}
