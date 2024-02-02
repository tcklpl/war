import { LobbyState, LobbyPlayerState } from "../../../../protocol";
import { Player } from "../player/player";

export class Lobby {

    private _players: Player[] = [];
    joinable = true;

    constructor(private _owner: Player, private _name: string) {
        this._players.push(this.owner);
    }

    addPlayer(p: Player) {
        if (!this._players.find(x => x === p)) this._players.push(p);
    }

    removePlayer(p: Player) {
        this._players = this._players.filter(x => x !== p);
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
            })
        }
    }
}