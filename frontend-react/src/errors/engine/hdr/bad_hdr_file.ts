
export class BadHDRFileError extends Error {

    constructor(msg?: string) {
        super(`Bad HDR file: ${msg}`);
    }

}