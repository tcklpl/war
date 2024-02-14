import { GameParty, LobbyState } from "../../../../protocol";
import { ClientPacketKickPlayer } from "../server/connection/packet/to_send/lobby/admin/kick_player";
import { ClientPacketModifyLobbyState } from "../server/connection/packet/to_send/lobby/admin/modify_lobby_state";
import { ClientPacketTransferLobbyOwnership } from "../server/connection/packet/to_send/lobby/admin/transfer_ownership";
import { ClientPacketDeselectParty } from "../server/connection/packet/to_send/lobby/common/deselect_current_party";
import { ClientPacketLeaveLobby } from "../server/connection/packet/to_send/lobby/common/leave_lobby";
import { ClientPacketSelectParty } from "../server/connection/packet/to_send/lobby/common/select_party";
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

    modifyLobbyState(state: LobbyState) {
        new ClientPacketModifyLobbyState(state).dispatch();
    }

    selectParty(party: GameParty) {
        new ClientPacketSelectParty(party).dispatch();
    }

    deselectCurrentParty() {
        new ClientPacketDeselectParty().dispatch();
    }

    get state() {
        return this._state;
    }

    get chat() {
        return this._chat;
    }

}