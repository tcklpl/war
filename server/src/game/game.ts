import { GameStatePlayerInfo, InitialGameStatePacket } from "../../../protocol";
import { LobbyNotReadyError } from "../exceptions/lobby_not_ready_error";
import { Board } from "./board/board";
import { Lobby } from "./lobby/lobby";
import { Player } from "./player/player";

export class Game {

    readonly board = new Board();
    private _players: Player[];
    private _owner!: Player;

    constructor(private _lobby: Lobby) {
        if (_lobby.players.some(p => !p.party)) throw new LobbyNotReadyError();
        // shuffle the player list, this will be the play order
        this._players = _lobby.players.sort(() => Math.random() - 0.5);
    }

    

    get initialGameStatePacket(): InitialGameStatePacket {
        return {
            territory_graph: this.board.asGraphTerritoryPacket,
            players: this._players.map(p => <GameStatePlayerInfo>{
                name: p.username,
                play_order: this._players.indexOf(p),
                party: p.party.protocolValue,
                is_lobby_owner: p === this._owner
            })
        }
    }
    

}