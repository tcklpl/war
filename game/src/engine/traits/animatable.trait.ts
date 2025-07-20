import type { AnimationPropertyAccessor } from ':engine/animation/animation-property-accessor';
import type { AnimationPropertyAccessorKey } from ':engine/animation/animation-property-accessor-key';
import type { AnimationValue } from ':engine/animation/animation-value';
import type { Constructor } from 'typeUtils';

export interface Animatable {
	getAnimationAccessor(key: AnimationPropertyAccessorKey): AnimationPropertyAccessor<AnimationValue> | undefined;
	registerAnimationPropertyAccessor(
		key: AnimationPropertyAccessorKey,
		accessor: AnimationPropertyAccessor<AnimationValue>,
	): void;
}

export function animatable<T extends Constructor>(base: T): Constructor<Animatable> & T {
	return class extends base {
		private readonly _animationPropertyAccessors = new Map<
			AnimationPropertyAccessorKey,
			AnimationPropertyAccessor<AnimationValue>
		>();

		registerAnimationPropertyAccessor(
			key: AnimationPropertyAccessorKey,
			accessor: AnimationPropertyAccessor<AnimationValue>,
		) {
			this._animationPropertyAccessors.set(key, accessor);
		}

		getAnimationAccessor(key: AnimationPropertyAccessorKey) {
			return this._animationPropertyAccessors.get(key);
		}
	};
}
