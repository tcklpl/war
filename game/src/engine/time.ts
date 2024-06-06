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
    static DeltaTime = 0;

    /**
     * Frames rendered on the last second.
     *
     * Updated every second.
     */
    static FPS = 0;
}
