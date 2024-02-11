import { LobbyState, LobbyPlayerState, GameConfig } from "../../../../protocol";
import { ServerPacketChatMessage } from "../../socket/packet/lobby/chat_message";
import { ServerPacketUpdateLobbyState } from "../../socket/packet/lobby/update_lobby_state";
import { Player } from "../player/player";

export class Lobby {

    private _players: Player[] = [];
    joinable = true;

    constructor(private _owner: Player, private _name: string, private _gameConfig: GameConfig) {
        this._players.push(this.owner);
    }

    addPlayer(p: Player) {
        if (!this._players.find(x => x === p)) {
            this._players.push(p);
            new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
        }
    }

    removePlayer(p: Player) {
        this._players = this._players.filter(x => x !== p);
        if (p === this._owner && this._players.length > 0) {
            this._owner = this._players[0];
        }
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
    }

    removeAllPlayers() {
        this._players.forEach(p => p.leaveCurrentLobby());
    }

    broadcastChatMessage(sender: Player, msg: string) {
        new ServerPacketChatMessage(sender, msg).dispatch(...this._players);
    }

    changeOwnership(newOwner: Player) {
        if (!this._players.find(p => p === newOwner)) return;
        this._owner = newOwner;
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
    }

    replaceLobbyState(state: LobbyState) {
        this.joinable = state.joinable;
        this._gameConfig = state.game_config;
    }

    get name() {
        return this._name;
    }

    get players() {
        return this._players;
    }

    get owner() {
        return this._owner;
    }

    get asProtocolLobbyState(): LobbyState {
        return {
            name: this._name,
            joinable: this.joinable,
            players: this._players.map(p => <LobbyPlayerState> {
                name: p.username,
                is_lobby_owner: p === this._owner
            }),
            game_config: this._gameConfig
        }
    }
}