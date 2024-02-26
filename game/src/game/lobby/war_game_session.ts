import { InitialGameStatePacket } from "../../../../protocol";
import { ListenableProperty } from "../server/listenable_property";

export class WarGameSession {

    private _currentTurnPlayerIndex = new ListenableProperty(0);

    constructor(
        public readonly initialGameState: InitialGameStatePacket
    ) {}

    get currentTurnPlayerIndex() {
        return this._currentTurnPlayerIndex;
    }

}