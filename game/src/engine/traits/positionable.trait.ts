import { AnimationPropertyAccessorKey } from ':engine/animation/animation-property-accessor-key';
import { Mat4 } from ':engine/data/mat/mat4';
import { Vec3 } from ':engine/data/vec/vec3';
import type { Constructor } from 'typeUtils';
import type { Animatable } from './animatable.trait';

export interface Positionable {
	get position(): Vec3;
	set position(value: Vec3);
	get positionMatrix(): Mat4;

	buildPositionMatrix(): void;
}

export function positionable<T extends Constructor<Animatable>>(base: T): Constructor<Positionable> & T {
	return class extends base {
		private _position = Vec3.fromValue(0);
		private _positionMatrix = Mat4.translation(0, 0, 0);

		constructor(...args: any[]) {
			super(...args);
			this.registerAnimationPropertyAccessor(AnimationPropertyAccessorKey.Position, {
				get: () => this.position,
				set: (value: Vec3) => (this.position = value),
			});
		}

		buildPositionMatrix() {
			this._positionMatrix = Mat4.translation(this.position.x, this.position.y, this.position.z);
		}

		get position() {
			return this._position;
		}

		set position(value) {
			this._position = value;
			this.buildPositionMatrix();
		}

		get positionMatrix() {
			return this._positionMatrix;
		}
	};
}
