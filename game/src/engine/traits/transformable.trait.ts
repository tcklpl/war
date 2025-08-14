import { Mat4 } from ':engine/data/mat/mat4';
import type { Constructor } from 'typeUtils';
import { Subject } from 'rxjs';
import type { Animatable } from './animatable.trait';
import { type Positionable, positionable } from './positionable.trait';
import { type Rotatable, rotatable } from './rotatable.trait';
import { type Scalable, scalable } from './scalable.trait';

export type Transformable = {
	buildModelMatrix(): void;

	registerChild(...children: Transformable[]): void;
	removeChild(...children: Transformable[]): void;
	clearChildren(): void;

	registerTransformableBuffer(buffer: GPUBuffer, offsets: TransformableBufferOffsets): void;

	get parent(): Transformable | undefined;
	set parent(parent: Transformable | undefined);
	get children(): Transformable[];

	get modelMatrix(): Mat4;
	get inverseModelMatrix(): Mat4;
	get windingOrder(): 'cw' | 'ccw';

	get transformSubject$(): Subject<void>;
};

export type TransformableBufferOffsets = {
	modelMatrix: number;
	inverseModelMatrix: number;
	previousFrameModelMatrix: number;
};

export function transformable<T extends Constructor<Animatable>>(
	base: T,
): Constructor<Transformable & Positionable & Rotatable & Scalable> & T {
	return class extends positionable(rotatable(scalable(base))) {
		private _parent?: Transformable;
		private _children: Transformable[] = [];

		private _modelMatrix = Mat4.identity();
		private _inverseModelMatrix = Mat4.identity();

		private _modelMatrixHasBeenUpdatedLastFrame = false;
		private _previousFrameModelMatrix = Mat4.identity();

		private _windingOrder: 'cw' | 'ccw' = 'ccw';

		private readonly _transformSubject$ = new Subject<void>();

		private _transformableBuffer?: GPUBuffer;
		private _transformableBufferOffsets?: TransformableBufferOffsets;

		constructor(...args: any[]) {
			super(args);
			game.engine.onFrame$.subscribe(() => this.updateLastFrameModelMatrix());
		}

		buildModelMatrix() {
			this._modelMatrix = Mat4.identity()
				.multiply(this.positionMatrix)
				.multiply(this.rotationMatrix)
				.multiply(this.scaleMatrix);

			if (this._parent) this._modelMatrix = this._parent.modelMatrix.multiply(this.modelMatrix);

			this._inverseModelMatrix = this.modelMatrix.inverse();

			// models that have a negative transformation matrix should be drawn in clockwise winding order, this allows mirrored geometry
			this._windingOrder = this._modelMatrix.determinant() >= 0 ? 'ccw' : 'cw';

			if (this._transformableBuffer && this._transformableBufferOffsets) {
				device.queue.writeBuffer(
					this._transformableBuffer,
					this._transformableBufferOffsets.modelMatrix,
					this.modelMatrix.toF32Array(),
				);
				device.queue.writeBuffer(
					this._transformableBuffer,
					this._transformableBufferOffsets.inverseModelMatrix,
					this.inverseModelMatrix.toF32Array(),
				);
			}

			// update children
			this._children.forEach(c => c.buildModelMatrix());

			this._transformSubject$.next();
			this._modelMatrixHasBeenUpdatedLastFrame = true;
		}

		registerTransformableBuffer(buffer: GPUBuffer, offsets: TransformableBufferOffsets) {
			this._transformableBuffer = buffer;
			this._transformableBufferOffsets = offsets;
		}

		private updateLastFrameModelMatrix() {
			if (!this._modelMatrixHasBeenUpdatedLastFrame) return;
			this._previousFrameModelMatrix = this.modelMatrix;
			if (this._transformableBuffer && this._transformableBufferOffsets) {
				device.queue.writeBuffer(
					this._transformableBuffer,
					this._transformableBufferOffsets.previousFrameModelMatrix,
					this._previousFrameModelMatrix.toF32Array(),
				);
			}
		}

		registerChild(...children: Transformable[]) {
			children.forEach(c => {
				c.parent = this;
				this.children.push(c);
			});
			this.buildModelMatrix();
		}

		removeChild(...children: Transformable[]) {
			children.forEach(c => {
				if (c.parent === this) c.parent = undefined;
			});
			this._children = this.children.filter(c => !children.find(x => x === c));
			this.buildModelMatrix();
		}

		clearChildren() {
			this.removeChild(...this._children);
		}

		get parent() {
			return this._parent;
		}

		set parent(parent: Transformable | undefined) {
			this._parent = parent;
			this.buildModelMatrix();
		}

		get children() {
			return this._children;
		}

		get modelMatrix() {
			return this._modelMatrix;
		}

		get inverseModelMatrix() {
			return this._inverseModelMatrix;
		}

		get windingOrder() {
			return this._windingOrder;
		}

		get transformSubject$() {
			return this._transformSubject$;
		}
	};
}
