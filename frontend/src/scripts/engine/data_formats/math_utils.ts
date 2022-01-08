export class MUtils {

    static degToRad(deg: number) {
        return deg * Math.PI / 180;
    }

    static clamp(min: number, max: number, value: number) {
        return (value >= max) ? max : ((value <= min) ? min : value);
    }

    static isBetween(min: number, max: number, value: number) {
        return min <= value && value <= max;
    }

    static normalize(min: number, max: number, value: number) {
        let amplitude = max - min;
        return (value - min) / amplitude;
    }
}