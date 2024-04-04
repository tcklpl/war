import { GameStage, GameStatePlayerInfo, InitialGameStatePacket, TerritoryCode, TurnAction } from "../../../../protocol";
import { PlayerWithParty } from "../../@types/utils";
import { LobbyNotReadyError } from "../../exceptions/lobby_not_ready_error";
import { ServerPacketUpdateGameStage } from "../../socket/packet/game/update_game_stage";
import { Board } from "../board/board";
import { Lobby } from "../lobby/lobby";
import { Player } from "../player/player";
import { InitialTerritorySelectionManager } from "./initial_territory_selection_manager";
import { TurnManager } from "./turn_manager";

export class Game {

    readonly board = new Board();
    private _players: PlayerWithParty[];
    private _owner!: Player;
    private _turnManager: TurnManager;
    private _initialTerritorySelectionManager = new InitialTerritorySelectionManager(this);

    constructor(private _lobby: Lobby, private _setLobbyStatus: (s: GameStage) => void) {
        if (_lobby.players.some(p => !p.party)) throw new LobbyNotReadyError();
        // shuffle the player list, this will be the play order
        this._players = _lobby.players.sort(() => Math.random() - 0.5);

        this._turnManager = new TurnManager(this._players, this.board, _lobby.gameConfig);
    }

    onPlayerAction(actionType: 'select initial territory' | 'game action', action: TerritoryCode | TurnAction, player: PlayerWithParty) {

        switch (actionType) {
            case 'select initial territory':
                this._initialTerritorySelectionManager.onTerritorySelection(player, action as TerritoryCode);
            break;
            case 'game action':
                this._turnManager.onTurnAction(player, action as TurnAction);
            break;
        }

    }

    setupGame() {
        this.runInitialTerritorySelection();
    }

    private runInitialTerritorySelection() {
        this._setLobbyStatus("selecting starting territory");

        new ServerPacketUpdateGameStage(this._lobby.status).dispatch(...this._players);
        this._initialTerritorySelectionManager.startPlayerTerritorySelection();
        this._initialTerritorySelectionManager.onSelectionFinished = () => this.startGameLoop();
    }

    private startGameLoop() {
        
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

    get players() {
        return this._players;
    }
    

}