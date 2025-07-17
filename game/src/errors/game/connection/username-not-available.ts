export class UsernameNotAvailableError extends Error {
	constructor(msg?: string) {
		super(`Username not Available: ${msg}`);
	}
}
