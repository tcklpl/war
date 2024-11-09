/**
 * Time Class
 *
 * This class exists to hold time-related values globally.
 * The values inside this class are constantly updated by the engine.
 */
export class Time {
    /**
     * Time since the last frame, measured in seconds.
     *
     * Updated every frame.
     */
    private static _deltaTime = 0;
    static get DeltaTime() {
        return this._deltaTime;
    }

    /**
     * Frames rendered on the last second.
     *
     * Updated every second.
     */
    private static _fps = 0;
    static get FPS() {
        return this._fps;
    }

    static updateDeltaTime(deltaTime: number) {
        this._deltaTime = deltaTime;
    }

    static updateFPS(fps: number) {
        this._fps = fps;
    }
}
