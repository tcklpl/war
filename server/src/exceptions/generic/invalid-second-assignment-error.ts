export class InvalidSecondAssignmentError extends Error {
	constructor(msg: string) {
		super(`Invalid Second Assignment > ${msg}`);
	}
}
