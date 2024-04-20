import { InitialGameStatePacket } from "../../../../protocol";
import { ClientPacketPing } from "../server/connection/packet/to_send/ingame/ping";
import { ListenableProperty } from "../server/listenable_property";

export class WarGameSession {

    private _currentTurnPlayerIndex = new ListenableProperty(0);
    
    private _ping = new ListenableProperty<number>(0);
    private _pingTask = -1;

    constructor(
        public readonly initialGameState: InitialGameStatePacket
    ) {
        this.measurePing();
    }

    private measurePing() {
        const start = Date.now();
        new ClientPacketPing(() => {
            const duration = Date.now() - start;
            this._ping.value = duration;
        }).dispatch();
        window.setTimeout(() => this.measurePing(), 1000);
    }

    cleanup() {
        window.clearTimeout(this._pingTask);
    }

    get currentTurnPlayerIndex() {
        return this._currentTurnPlayerIndex;
    }

    get ping() {
        return this._ping;
    }

}