import { LobbyState } from "../../../../protocol";
import { ClientPacketLeaveLobby } from "../server/connection/packet/lobby/leave_lobby";
import { ListenableProperty } from "../server/listenable_property";

export class WarGameLobby {

    private _state: ListenableProperty<LobbyState>;

    constructor(state: LobbyState) {
        this._state = new ListenableProperty(state);
    }

    leave() {
        new ClientPacketLeaveLobby().dispatch();
    }

    get state() {
        return this._state;
    }

}