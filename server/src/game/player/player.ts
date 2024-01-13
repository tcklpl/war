import { AuthTokenBody } from "../../../../protocol";

export class Player {

    private _username: string;
    private _ip: string;

    constructor(authTokenBody: AuthTokenBody) {
        this._username = authTokenBody.username;
        this._ip = authTokenBody.ip;
    }

    get username() {
        return this._username;
    }

    get ip() {
        return this._ip;
    }
}