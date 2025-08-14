import { AnimationPropertyAccessorKey } from ':engine/animation/animation-property-accessor-key';
import { Vec4 } from ':engine/data/vec/vec4';
import type { Constructor } from 'typeUtils';
import type { Animatable } from './animatable.trait';

export interface Overlayable {
	get overlay(): Vec4;
	set overlay(color: Vec4);

	registerOverlayableBuffer(buffer: GPUBuffer, offset: number): void;
}

export function overlayable<T extends Constructor<Animatable>>(base: T): Constructor<Overlayable> & T {
	return class extends base {
		private _overlay = Vec4.fromValue(0);

		private _overlayableBuffer?: GPUBuffer;
		private _overlayableBufferOffset?: number;

		constructor(...args: any[]) {
			super(args);
			this.registerAnimationPropertyAccessor(AnimationPropertyAccessorKey.Overlay, {
				get: () => this.overlay,
				set: (color: Vec4) => (this.overlay = color),
			});
		}

		registerOverlayableBuffer(buffer: GPUBuffer, offset: number) {
			this._overlayableBuffer = buffer;
			this._overlayableBufferOffset = offset;
		}

		private writeOverlayToBuffer() {
			if (!this._overlayableBuffer || !this._overlayableBufferOffset) {
				console.warn('Trying to write outlinable values with no buffer');
				return;
			}
			device.queue.writeBuffer(this._overlayableBuffer, this._overlayableBufferOffset, this._overlay.asF32Array);
		}

		get overlay() {
			return this._overlay;
		}

		set overlay(color: Vec4) {
			this._overlay = color;
			this.writeOverlayToBuffer();
		}
	};
}
