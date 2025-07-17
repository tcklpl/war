import type { ClientToServerPackets } from ':protocol';

type ClientPacketEventNames = keyof ClientToServerPackets;
type ClientPacketEventParams<Event extends ClientPacketEventNames> = Parameters<ClientToServerPackets[Event]>;

export abstract class ClientPacket<E extends ClientPacketEventNames> {
	private readonly _params: ClientPacketEventParams<E>;

	constructor(
		private readonly _key: E,
		...params: ClientPacketEventParams<E>
	) {
		this._params = params;
	}

	dispatch() {
		if (!game.state.server) console.warn('Trying to dispatch packet with an undefined server state');
		game.state.server?.connection.emitPacket(this);
	}

	get key() {
		return this._key;
	}

	get params() {
		return this._params;
	}
}
