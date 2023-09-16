
export class RenderPostEffects {
    
    exposure = 1;
    gamma = 2.2;

    vignette = {
        active: false,
        /**
         * Vignette exponent, how strong the effect is.
         */
        strength: 0.1,
        /**
         * How far away from the center of the screen the vignette starts.
         * 
         * Higher values make the effect look square-ish and lower values tend to darken the
         * scene as a whole, as the effect starts too soon.
         */
        size: 20
    };

    chromaticAberration = {
        active: false,
        /**
         * Number of pixels to offset the red and blue values.
         */
        amount: 3
    };

    writeToBuffer(buffer: GPUBuffer) {
        // write options
        device.queue.writeBuffer(buffer, 0, new Uint32Array([
            this.vignette.active ? 1 : 0, 
            this.chromaticAberration.active ? 1 : 0
        ]));

        // write options
        device.queue.writeBuffer(buffer, 8, new Float32Array([
            this.gamma, this.exposure, 
            this.vignette.strength, this.vignette.size, 
            this.chromaticAberration.amount
        ]));
    }

}