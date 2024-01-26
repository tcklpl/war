import { ServerToClientPackets } from "../../../../protocol";
import { Player } from "../../game/player/player";

export abstract class ServerPacket {

    constructor(
        private _key: keyof ServerToClientPackets,
        private _parameters: Parameters<ServerToClientPackets[typeof _key]>
    ) {}

    dispatch(...targets: Player[]) {
        targets.forEach(t => {
            t.connection.emitPacket(this);
        });
    }

    get key() {
        return this._key;
    }

    get parameters() {
        return this._parameters;
    }

}