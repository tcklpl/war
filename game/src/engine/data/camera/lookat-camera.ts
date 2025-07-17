import { Mat4 } from '../mat/mat4';
import type { Vec3 } from '../vec/vec3';
import { Camera } from './camera';

export class LookAtCamera extends Camera {
	private _target: Vec3;

	constructor(pos: Vec3, target: Vec3, up: Vec3) {
		super(pos, up);
		this._target = target;
		this.generateCameraMatrix();
	}

	generateCameraMatrix(): void {
		this.cameraMatrix = Mat4.cameraAim(this.position, this.target, this.up);
	}

	get target() {
		return this._target;
	}

	set target(t: Vec3) {
		this._target = t;
		this.generateCameraMatrix();
	}
}
