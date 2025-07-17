import type { SocketRouteData } from './socket-route-data';

export abstract class PacketListener {
	constructor(protected _data: SocketRouteData) {
		this.register();
	}

	abstract register(): void;
}
