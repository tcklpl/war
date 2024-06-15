import { SocketRouteData } from './socket_route_data';

export abstract class PacketListener {
    constructor(protected _data: SocketRouteData) {
        this.register();
    }

    abstract register(): void;
}
