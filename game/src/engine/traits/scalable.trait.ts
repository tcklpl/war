import { AnimationPropertyAccessorKey } from ':engine/animation/animation-property-accessor-key';
import { Mat4 } from ':engine/data/mat/mat4';
import { Vec3 } from ':engine/data/vec/vec3';
import type { Constructor } from 'typeUtils';
import type { Animatable } from './animatable.trait';

export interface Scalable {
	get scale(): Vec3;
	set scale(value: Vec3);
	get scaleMatrix(): Mat4;

	buildScaleMatrix(): void;
}

export function scalable<T extends Constructor<Animatable>>(base: T): Constructor<Scalable> & T {
	return class extends base {
		private _scale = Vec3.fromValue(1);
		private _scaleMatrix = Mat4.scaling(1, 1, 1);

		constructor(...args: any[]) {
			super(...args);
			this.registerAnimationPropertyAccessor(AnimationPropertyAccessorKey.Scale, {
				get: () => this.scale,
				set: (value: Vec3) => (this.scale = value),
			});
		}

		buildScaleMatrix() {
			this._scaleMatrix = Mat4.scaling(this.scale.x, this.scale.y, this.scale.z);
		}

		get scale() {
			return this._scale;
		}

		set scale(value) {
			this._scale = value;
			this.buildScaleMatrix();
		}

		get scaleMatrix() {
			return this._scaleMatrix;
		}
	};
}
