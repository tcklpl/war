import { ClientToServerPackets } from "../../../../../../protocol";
import { WarServer } from "../../war_server";

export abstract class ClientPacket {

    private _params: Parameters<ClientToServerPackets[typeof this._key]>;

    constructor(
        private _key: keyof ClientToServerPackets,
        ...params: Parameters<ClientToServerPackets[typeof _key]>
    ) {
        this._params = params;
    }

    dispatch(server: WarServer) {
        server.connection.emitPacket(this);
    }

    get key() {
        return this._key;
    }

    get params() {
        return this._params;
    }
}