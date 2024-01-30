import { AuthTokenBody } from "../../../../protocol";
import { PlayerConnection } from "./player_connection";
import { PlayerStatus } from "./player_status";
import { GameSocket } from "../../@types/server_socket";

export class Player {

    private _username: string;
    private _ip: string;
    private _connection: PlayerConnection;
    private _status = PlayerStatus.IN_LOBBY_LIST;

    constructor(authTokenBody: AuthTokenBody, socket: GameSocket) {
        this._username = authTokenBody.username;
        this._ip = authTokenBody.ip;
        this._connection = new PlayerConnection(this, socket);
    }

    get username() {
        return this._username;
    }

    get ip() {
        return this._ip;
    }

    get connection() {
        return this._connection;
    }

    get status() {
        return this._status;
    }
}