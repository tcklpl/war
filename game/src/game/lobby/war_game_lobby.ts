import { GameParty, LobbyState } from "../../../../protocol";
import { ClientPacketCancelGameStart } from "../server/connection/packet/to_send/lobby/admin/cancel_game_start";
import { ClientPacketKickPlayer } from "../server/connection/packet/to_send/lobby/admin/kick_player";
import { ClientPacketModifyLobbyState } from "../server/connection/packet/to_send/lobby/admin/modify_lobby_state";
import { ClientPacketStartGame } from "../server/connection/packet/to_send/lobby/admin/start_game";
import { ClientPacketTransferLobbyOwnership } from "../server/connection/packet/to_send/lobby/admin/transfer_ownership";
import { ClientPacketDeselectParty } from "../server/connection/packet/to_send/lobby/common/deselect_current_party";
import { ClientPacketLeaveLobby } from "../server/connection/packet/to_send/lobby/common/leave_lobby";
import { ClientPacketSelectParty } from "../server/connection/packet/to_send/lobby/common/select_party";
import { ListenableProperty } from "../server/listenable_property";
import { LobbyChat } from "./lobby_chat";
import { WarGameSession } from "./war_game_session";

export class WarGameLobby {

    private _state: ListenableProperty<LobbyState>;
    private _chat = new LobbyChat();
    
    private readonly _gameStartCountdown = new ListenableProperty<number>();
    private _taskGameStartCountdown?: number;

    readonly gameSession = new ListenableProperty<WarGameSession>();

    constructor(state: LobbyState) {
        this._state = new ListenableProperty(state);
    }

    leave() {
        new ClientPacketLeaveLobby().dispatch();
        this.cleanup();
    }

    cleanup() {
        this.cancelGameStartCountdown();
        this.gameSession.value?.cleanup();
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

    startGame() {
        new ClientPacketStartGame().dispatch();
    }

    cancelGameStart() {
        new ClientPacketCancelGameStart().dispatch();
    }

    setGameStartingCountdown(cd: number) {
        if (this._taskGameStartCountdown) this.cancelGameStartCountdown();

        this._gameStartCountdown.value = cd;
        const decrease = () => {
            this._taskGameStartCountdown = window.setTimeout(() => {
                if (this._gameStartCountdown.value && this._gameStartCountdown.value > 0) {
                    this._gameStartCountdown.value = this._gameStartCountdown.value - 1;
                    decrease();
                }
            }, 1000);
        }
        
        decrease();
    }

    cancelGameStartCountdown() {
        clearTimeout(this._taskGameStartCountdown);
        this._gameStartCountdown.value = undefined;
    }

    get state() {
        return this._state;
    }

    get chat() {
        return this._chat;
    }

    get gameStartCountdown() {
        return this._gameStartCountdown;
    }

}