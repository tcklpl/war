import type { Mat4 } from ':engine/data/mat/mat4';
import { Vec4 } from ':engine/data/vec/vec4';

export class MatrixUtils {
	static getFrustumCornersWorldSpace(projection: Mat4, view: Mat4) {
		const inv = projection.multiply(view).inverse();
		const corners: Vec4[] = [];

		for (let x = 0; x < 2; x++) {
			for (let y = 0; y < 2; y++) {
				for (let z = 0; z < 2; z++) {
					const point = new Vec4(2 * x - 1, 2 * y - 1, 2 * z - 1, 1);
					const transformed = inv.multiplyByVec4(point).divideFactor(point.w);
					corners.push(transformed);
				}
			}
		}

		return corners;
	}
}
