import { GameSocket } from '../../@types/server_socket';
import { ServerPacket, ServerPacketEventNames } from '../../socket/packet/server_packet';

export class PlayerConnection {
    constructor(private readonly _socket: GameSocket) {}

    emitPacket<T extends ServerPacketEventNames>(pkt: ServerPacket<T>) {
        this._socket.emit(pkt.key, ...pkt.params);
    }

    get socket() {
        return this._socket;
    }
}
