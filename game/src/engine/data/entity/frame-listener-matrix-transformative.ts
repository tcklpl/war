import { frameListener } from '../../traits/frame-listener';
import { Mat4 } from '../mat/mat4';
import { MatrixTransformative } from './matrix-transformative';

export class FrameListenerMatrixTransformative extends frameListener(MatrixTransformative) {
	private _previousFrameModelMatrix = Mat4.identity();

	onFrame(_deltaTime: number): void {
		this._previousFrameModelMatrix = this.modelMatrix;
		device.queue.writeBuffer(
			this.modelMatrixUniformBuffer,
			2 * Mat4.byteSize,
			this._previousFrameModelMatrix.toF32Array(),
		);
	}

	get previousFrameModelMatrix() {
		return this._previousFrameModelMatrix;
	}
}
