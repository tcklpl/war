import { AnimationPropertyAccessorKey } from ':engine/animation/animation-property-accessor-key';
import type { Mat4 } from ':engine/data/mat/mat4';
import { Quaternion } from ':engine/data/quaternion/quaternion';
import type { Constructor } from 'typeUtils';
import type { Animatable } from './animatable.trait';

export interface Rotatable {
	get rotation(): Quaternion;
	set rotation(value: Quaternion);
	get rotationMatrix(): Mat4;

	buildRotationMatrix(): void;
}

export function rotatable<T extends Constructor<Animatable>>(base: T): Constructor<Rotatable> & T {
	return class extends base {
		private _rotation = Quaternion.fromEulerAnglesDegrees(0, 0, 0);
		private _rotationMatrix = this._rotation.toMat4();

		constructor(...args: any[]) {
			super(...args);
			this.registerAnimationPropertyAccessor(AnimationPropertyAccessorKey.Rotation, {
				get: () => this.rotation,
				set: (value: Quaternion) => (this.rotation = value),
			});
		}

		buildRotationMatrix() {
			this._rotationMatrix = this.rotation.toMat4();
		}

		get rotation() {
			return this._rotation;
		}

		set rotation(value) {
			this._rotation = value;
			this.buildRotationMatrix();
		}

		get rotationMatrix() {
			return this._rotationMatrix;
		}
	};
}
