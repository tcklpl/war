import { BRDFConvolutionIntegralShader } from "../../../shaders/brdf_convolution_integral/brdf_convolution_integral_shader";

export class BRDFLUTRenderer {

    private _lutShader!: BRDFConvolutionIntegralShader;
    private _pipeline!: GPURenderPipeline;
    private _renderPassDescriptor!: GPURenderPassDescriptor;

    async initialize() {

        await new Promise<void>(r => {
            this._lutShader = new BRDFConvolutionIntegralShader('BRDF LUT shader', () => r());
        });

        this._pipeline = this.createPipeline();
        this._renderPassDescriptor = this.createRenderPassDescriptor();

    }

    private createPipeline() {
        return device.createRenderPipeline({
            label: 'BRDF LUT pipeline',
            layout: 'auto',
            vertex: {
                module: this._lutShader.module,
                entryPoint: 'vertex'
            },
            fragment: {
                module: this._lutShader.module,
                entryPoint: 'fragment',
                targets: [
                    { format: 'rg16float' as GPUTextureFormat }
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
                    clearValue: { r: 0, g: 0, b: 0, a: 0 },
                    loadOp: 'clear',
                    storeOp: 'store'
                } as GPURenderPassColorAttachment
            ]
        } as GPURenderPassDescriptor;
    }

    async renderLUT(resolution = 512) {
        // create destination texture
        const renderTarget = device.createTexture({
            label: 'LUT texture',
            format: 'rg16float',
            dimension: '2d',
            size: [resolution, resolution],
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT
        });

        
        (this._renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view = renderTarget.createView();
        
        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass(this._renderPassDescriptor);

        passEncoder.setPipeline(this._pipeline);

        // draw to texture
        // will draw 6 vertices, no data needs to be supplied as the vertices are hard coded into the shader
        passEncoder.draw(6);
        passEncoder.end();

        device.queue.submit([commandEncoder.finish()]);

        // wait for all the rendering to be done and return the texture
        await device.queue.onSubmittedWorkDone();
        return renderTarget;
    }

    free() {
        
    }
}