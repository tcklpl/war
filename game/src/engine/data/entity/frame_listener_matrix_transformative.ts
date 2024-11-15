import { Mat4 } from '../mat/mat4';
import { frameListener } from '../traits/frame_listener';
import { MatrixTransformative } from './matrix_transformative';

export class FrameListenerMatrixTransformative extends frameListener(MatrixTransformative) {
    private _previousFrameModelMatrix = Mat4.identity();

    onEachFrame(_deltaTime: number): void {
        this._previousFrameModelMatrix = this.modelMatrix;
        device.queue.writeBuffer(
            this.modelMatrixUniformBuffer,
            2 * Mat4.byteSize,
            this._previousFrameModelMatrix.asF32Array,
        );
    }

    get previousFrameModelMatrix() {
        return this._previousFrameModelMatrix;
    }
}
