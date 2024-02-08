import { LobbyState } from "../../../../protocol";
import { ClientPacketKickPlayer } from "../server/connection/packet/lobby/kick_player";
import { ClientPacketLeaveLobby } from "../server/connection/packet/lobby/leave_lobby";
import { ClientPacketTransferLobbyOwnership } from "../server/connection/packet/lobby/transfer_ownership";
import { ListenableProperty } from "../server/listenable_property";
import { LobbyChat } from "./lobby_chat";

export class WarGameLobby {

    private _state: ListenableProperty<LobbyState>;
    private _chat = new LobbyChat();

    constructor(state: LobbyState) {
        this._state = new ListenableProperty(state);
    }

    leave() {
        new ClientPacketLeaveLobby().dispatch();
        this._chat.eraseHistory();
    }

    transferOwnership(newOwner: string) {
        new ClientPacketTransferLobbyOwnership(newOwner).dispatch();
    }

    kickPlayer(player: string) {
        new ClientPacketKickPlayer(player).dispatch();
    }

    get state() {
        return this._state;
    }

    get chat() {
        return this._chat;
    }

}