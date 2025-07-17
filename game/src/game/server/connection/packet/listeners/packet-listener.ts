import type { GameSocket } from '../../../../../@types/socket';
import type { WarServer } from '../../../war-server';

export abstract class PacketListener {
	constructor(
		private readonly _socket: GameSocket,
		private readonly _server: WarServer,
	) {
		this.register();
	}

	abstract register(): void;

	protected get socket() {
		return this._socket;
	}

	protected get server() {
		return this._server;
	}
}
