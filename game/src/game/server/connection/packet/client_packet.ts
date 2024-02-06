import { ClientToServerPackets } from "../../../../../../protocol";

export abstract class ClientPacket {

    private _params: Parameters<ClientToServerPackets[typeof this._key]>;

    constructor(
        private _key: keyof ClientToServerPackets,
        ...params: Parameters<ClientToServerPackets[typeof _key]>
    ) {
        this._params = params;
    }

    dispatch() {
        if (!game.state.server) console.warn(`Trying to dispatch packet with an undefined server state`);
        game.state.server?.connection.emitPacket(this);
    }

    get key() {
        return this._key;
    }

    get params() {
        return this._params;
    }
}