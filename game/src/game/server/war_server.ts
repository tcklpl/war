import { ServerRoomListState } from "../../../../protocol";
import { registerPacketListeners } from "./connection/packet/listeners/packet_listeners";
import { ClientPacketRequireRoomList } from "./connection/packet/lobby/req_room_list";
import { ServerConnection } from "./connection/server_connection";
import { ListenableProperty } from "./listenable_property";

export class WarServer {

    private _gameRooms = new ListenableProperty<ServerRoomListState>();

    constructor(private _connection: ServerConnection) {
        registerPacketListeners(_connection.socket, this);
    }

    requestRoomList() {
        new ClientPacketRequireRoomList().dispatch(this);
    }

    get connection() {
        return this._connection;
    }

    get gameRooms() {
        return this._gameRooms;
    }

}