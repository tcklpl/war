import { LobbyListState } from "../../../../protocol";
import { registerPacketListeners } from "./connection/packet/listeners/packet_listeners";
import { ClientPacketRequireLobbies } from "./connection/packet/lobby/req_lobbies";
import { ServerConnection } from "./connection/server_connection";
import { ListenableProperty } from "./listenable_property";

export class WarServer {

    private _lobbies = new ListenableProperty<LobbyListState>();

    constructor(private _connection: ServerConnection) {
        registerPacketListeners(_connection.socket, this);
    }

    requestLobbies() {
        new ClientPacketRequireLobbies().dispatch(this);
    }

    get connection() {
        return this._connection;
    }

    get lobbies() {
        return this._lobbies;
    }

}