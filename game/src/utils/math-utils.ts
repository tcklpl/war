export class MathUtils {
	static degToRad(deg: number) {
		return (deg * Math.PI) / 180;
	}

	static radToDeg(rad: number) {
		return (rad * 180) / Math.PI;
	}

	static clamp(min: number, max: number, value: number) {
		if (value < min) return min;
		if (value > max) return max;
		return value;
	}

	static ensurePadding(value: number, dividend = 16) {
		return Math.ceil(value / dividend) * dividend;
	}

	static lerp(a: number, b: number, factor: number) {
		return a + factor * (b - a);
	}

	static haltonSequence(base: number, index: number) {
		let result = 0;
		let f = 1;
		let curIndex = index;
		while (curIndex > 0) {
			f /= base;
			result += f * (curIndex % base);
			curIndex = Math.floor(curIndex / base);
		}
		return result;
	}
}
