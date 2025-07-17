export class WrongPasswordError extends Error {
	constructor(msg?: string) {
		super(`Wrong Password: ${msg}`);
	}
}
