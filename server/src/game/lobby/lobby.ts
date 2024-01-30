import { Player } from "../player/player";

export class Lobby {

    private _players: Player[] = [];
    joinable = true;

    constructor(private _owner: Player, private _name: string) {
        this._players.push(this.owner);
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
}