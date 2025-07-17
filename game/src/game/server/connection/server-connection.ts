import type { ClientToServerPackets, ServerToClientPackets } from ':protocol';
import type { Socket } from 'socket.io-client';
import type { ClientPacket } from './packet/client-packet';

type ClientPacketEventNames = keyof ClientToServerPackets;

export class ServerConnection {
	constructor(
		private readonly _address: string,
		private readonly _socket: Socket<ServerToClientPackets, ClientToServerPackets>,
		private readonly _token: string,
	) {}

	emitPacket<T extends ClientPacketEventNames>(pkt: ClientPacket<T>) {
		this._socket.emit(pkt.key, ...pkt.params);
	}

	closeConnection() {
		this._socket.disconnect();
	}

	get address() {
		return this._address;
	}

	get socket() {
		return this._socket;
	}

	get token() {
		return this._token;
	}
}
