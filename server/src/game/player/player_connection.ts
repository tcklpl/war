import { Player } from "./player";
import { GameSocket } from "../../@types/server_socket";
import { ServerPacket } from "../../socket/packet/server_packet";

export class PlayerConnection {

    constructor(private _player: Player, private _socket: GameSocket) {}

    emitPacket(pkt: ServerPacket) {
        this._socket.emit(pkt.key, ...pkt.params);
    }

    get socket() {
        return this._socket;
    }

    get player() {
        return this._player;
    }
}