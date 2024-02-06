import { AuthTokenBody } from "../../../../protocol";
import { PlayerConnection } from "./player_connection";
import { PlayerStatus } from "./player_status";
import { GameSocket } from "../../@types/server_socket";
import { Lobby } from "../lobby/lobby";

export class Player {

    private _username: string;
    private _ip: string;
    private _connection: PlayerConnection;
    private _status = PlayerStatus.IN_LOBBY_LIST;

    private _lobby?: Lobby;

    constructor(authTokenBody: AuthTokenBody, socket: GameSocket) {
        this._username = authTokenBody.username;
        this._ip = authTokenBody.ip;
        this._connection = new PlayerConnection(this, socket);
    }

    joinLobby(lobby: Lobby) {
        this._status = PlayerStatus.IN_LOBBY;
        this._lobby = lobby;
        this._lobby.addPlayer(this);
    }

    leaveCurrentLobby() {
        this._status = PlayerStatus.IN_LOBBY_LIST;
        this._lobby?.removePlayer(this);
        this._lobby = undefined;
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

    get lobby() {
        return this._lobby;
    }
}