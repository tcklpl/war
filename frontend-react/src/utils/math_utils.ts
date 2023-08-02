
export class MathUtils {

    static degToRad(deg: number) {
        return deg * Math.PI / 180;
    }

    static radToDeg(rad: number) {
        return rad * 180 / Math.PI;
    }

    static clamp(min: number, max: number, value: number) {
        return (value > max ? max : (value < min ? min : value));
    }

}