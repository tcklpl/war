import { Logger } from "../../log/logger";
import { SocketRouteData } from "./socket_route_data";

export abstract class PacketListener {

    constructor(
        protected _data: SocketRouteData,
        protected _log: Logger
    ) {
        this.register();
    };

    abstract register(): void;

}