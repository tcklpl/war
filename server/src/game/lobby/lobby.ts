import { LobbyState, LobbyPlayerState, GameConfig, GameParty } from "../../../../protocol";
import { ServerPacketChatMessage } from "../../socket/packet/lobby/chat_message";
import { ServerPacketUpdateLobbyState } from "../../socket/packet/lobby/update_lobby_state";
import { PartyAnarchism } from "../party/anarchism";
import { PartyCapitalism } from "../party/capitalism";
import { PartyFeudalism } from "../party/feudalism";
import { PartyNotSet } from "../party/not_set";
import { Party } from "../party/party";
import { PartySocialism } from "../party/socialism";
import { Player } from "../player/player";

export class Lobby {

    private _players: Player[] = [];
    joinable = true;
    private _parties: Party[] = [
        new PartyAnarchism(),
        new PartyFeudalism(),
        new PartySocialism(),
        new PartyCapitalism()
    ];

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
        if (p.party) {
            p.party.player = undefined;
            p.party = new PartyNotSet();
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

        if (!this._gameConfig.is_immutable) {
            this._gameConfig = state.game_config;
        }
    }

    setPlayerParty(player: Player, protocolParty: GameParty) {
        const party = this._parties.find(p => p.protocolValue === protocolParty);
        if (!party || !(player.party instanceof PartyNotSet) || party.player) return;
        player.party = party;
        party.player = player;
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
    }

    deselectPlayerParty(player: Player) {
        player.party = new PartyNotSet();
        this._parties.filter(p => p.player === player).forEach(p => p.player = undefined);
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
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
                is_lobby_owner: p === this._owner,
                party: p.party?.protocolValue
            }),
            game_config: this._gameConfig,
            selectable_parties: this._parties.filter(p => !p.player).map(p => p.protocolValue)
        }
    }
}