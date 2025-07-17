import type { Primitive } from './primitive';
import type { PrimitiveDrawOptions } from './primitive-draw-options';

export class Mesh {
	private readonly _name: string;
	private readonly _primitives: Primitive[];

	constructor(name: string, primitives: Primitive[]) {
		this._name = name;
		this._primitives = primitives;
	}

	get name() {
		return this._name;
	}

	draw(passEncoder: GPURenderPassEncoder, pipeline: GPURenderPipeline, options: PrimitiveDrawOptions) {
		this._primitives.forEach(p => p.draw(passEncoder, pipeline, options));
	}

	free() {
		this._primitives.forEach(p => p.free());
	}
}
