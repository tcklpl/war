import { AnimationPropertyAccessorKey } from ':engine/animation/animation-property-accessor-key';
import { Vec4 } from ':engine/data/vec/vec4';
import type { Constructor } from 'typeUtils';
import type { Animatable } from './animatable.trait';

export interface Outlinable {
	get outlineColor(): Vec4;
	set outlineColor(color: Vec4);

	registerOutlinableBuffer(buffer: GPUBuffer, offset: number): void;
}

export function outlinable<T extends Constructor<Animatable>>(base: T): Constructor<Outlinable> & T {
	return class extends base {
		private _outlineColor = Vec4.fromValue(0);

		private _outlinableBuffer?: GPUBuffer;
		private _outlinableBufferOffset?: number;

		constructor(...args: any[]) {
			super(args);
			this.registerAnimationPropertyAccessor(AnimationPropertyAccessorKey.Outline, {
				get: () => this.outlineColor,
				set: (color: Vec4) => (this.outlineColor = color),
			});
		}

		registerOutlinableBuffer(buffer: GPUBuffer, offset: number) {
			this._outlinableBuffer = buffer;
			this._outlinableBufferOffset = offset;
		}

		private writeOutlineToBuffer() {
			if (!this._outlinableBuffer || !this._outlinableBufferOffset) {
				console.warn('Trying to write outlinable values with no buffer');
				return;
			}
			device.queue.writeBuffer(
				this._outlinableBuffer,
				this._outlinableBufferOffset,
				this._outlineColor.asF32Array,
			);
		}

		get outlineColor() {
			return this._outlineColor;
		}

		set outlineColor(color: Vec4) {
			this._outlineColor = color;
			this.writeOutlineToBuffer();
		}
	};
}
