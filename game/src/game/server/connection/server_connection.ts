import { Socket } from 'socket.io-client';
import { ClientToServerPackets, ServerToClientPackets } from '../../../../../protocol';
import { ClientPacket } from './packet/client_packet';

type ClientPacketEventNames = keyof ClientToServerPackets;

export class ServerConnection {
    constructor(
        private _socket: Socket<ServerToClientPackets, ClientToServerPackets>,
        private _token: string,
    ) {}

    emitPacket<T extends ClientPacketEventNames>(pkt: ClientPacket<T>) {
        this._socket.emit(pkt.key, ...pkt.params);
    }

    get socket() {
        return this._socket;
    }

    get token() {
        return this._token;
    }
}
