export class BindDeletedMeshPrimitiveError extends Error {
	constructor(msg?: string) {
		super(`Binding deleted mesh primitive: ${msg}`);
	}
}
