export class BadQuaternionLengthError extends Error {
	constructor(msg?: string) {
		super(`Bad quaternion length: ${msg}`);
	}
}
