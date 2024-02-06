import { ServerToClientPackets } from "../../../../protocol";
import { Player } from "../../game/player/player";

export abstract class ServerPacket {

    private _params: Parameters<ServerToClientPackets[typeof this._key]>;

    constructor(
        private _key: keyof ServerToClientPackets,
        ...params: Parameters<ServerToClientPackets[typeof _key]>
    ) {
        this._params = params;
    }

    dispatch(...targets: Player[]) {
        targets.forEach(t => {
            t.connection.emitPacket(this);
        });
    }

    get key() {
        return this._key;
    }

    get params() {
        return this._params;
    }

}