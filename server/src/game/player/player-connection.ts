import type { GameSocket } from '../../@types/server-socket';
import type { ServerPacket, ServerPacketEventNames } from '../../socket/packet/server-packet';

export class PlayerConnection {
	constructor(private readonly _socket: GameSocket) {}

	emitPacket<T extends ServerPacketEventNames>(pkt: ServerPacket<T>) {
		this._socket.emit(pkt.key, ...pkt.params);
	}

	get socket() {
		return this._socket;
	}
}
