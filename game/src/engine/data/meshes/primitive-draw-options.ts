interface PrimitiveDrawOptionsEntry {
	use: boolean;
	index: number;
}

export class PrimitiveDrawOptions {
	private _position: PrimitiveDrawOptionsEntry = { use: false, index: -1 };
	private _uv: PrimitiveDrawOptionsEntry = { use: false, index: -1 };
	private _normal: PrimitiveDrawOptionsEntry = { use: false, index: -1 };
	private _tangent: PrimitiveDrawOptionsEntry = { use: false, index: -1 };
	private _useMaterial = false;

	includePosition(index: number) {
		this._position = { use: true, index };
		return this;
	}

	includeUV(index: number) {
		this._uv = { use: true, index };
		return this;
	}

	includeNormal(index: number) {
		this._normal = { use: true, index };
		return this;
	}

	includeTangent(index: number) {
		this._tangent = { use: true, index };
		return this;
	}

	includeMaterial() {
		this._useMaterial = true;
		return this;
	}

	includeAll() {
		return this.includePosition(0).includeUV(1).includeNormal(2).includeTangent(3).includeMaterial();
	}

	get position() {
		return this._position;
	}

	get uv() {
		return this._uv;
	}

	get normal() {
		return this._normal;
	}

	get tangent() {
		return this._tangent;
	}

	get useMaterial() {
		return this._useMaterial;
	}
}
