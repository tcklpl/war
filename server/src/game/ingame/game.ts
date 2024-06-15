import {
    GameStage,
    GameStatePlayerInfo,
    InitialGameStatePacket,
    TerritoryCode,
    TurnAction,
} from '../../../../protocol';
import { LobbyNotReadyError } from '../../exceptions/lobby_not_ready_error';
import { Logger } from '../../log/logger';
import { ServerPacketUpdateGameStage } from '../../socket/packet/game/update_game_stage';
import { Board } from '../board/board';
import { Lobby } from '../lobby/lobby';
import { GamePlayer } from '../player/game_player';
import { InitialTerritorySelectionManager } from './initial_territory_selection_manager';
import { TurnManager } from './turn_manager';

export class Game {
    // basic state
    readonly id = crypto.randomUUID();
    private readonly _players: GamePlayer[];
    private _owner!: GamePlayer;
    private _stage: GameStage = 'starting';

    // game managers
    readonly board = new Board(this._log.createChildContext('Board'));
    private _turnManager: TurnManager;
    private _initialTerritorySelectionManager = new InitialTerritorySelectionManager(
        this,
        this._log.createChildContext('Initial Territory Selection'),
    );

    constructor(
        private _lobby: Lobby,
        private _log: Logger,
    ) {
        if (_lobby.players.some(p => !p.party)) throw new LobbyNotReadyError();

        const consummatedPlayers = _lobby.players.map(p => {
            const consummated = p.transformIntoGamePlayer(this);
            if (_lobby.owner === p) this._owner = consummated;
            return consummated;
        });

        // shuffle the player list, this will be the play order
        this._players = consummatedPlayers.sort(() => Math.random() - 0.5);

        this._turnManager = new TurnManager(
            this._players,
            this.board,
            _lobby.gameConfig,
            this._log.createChildContext('Turn Manager'),
        );
    }

    onPlayerAction(
        actionType: 'select initial territory' | 'game action',
        action: TerritoryCode | TurnAction,
        player: GamePlayer,
    ) {
        switch (actionType) {
            case 'select initial territory':
                this._initialTerritorySelectionManager.onTerritorySelection(player, action as TerritoryCode);
                break;
            case 'game action':
                this._turnManager.onTurnAction(player, action as TurnAction);
                break;
        }
    }

    /**
     * First function to be called when starting the game (after the countdown is over).
     */
    setupGame() {
        this._log.debug(`Starting game ${this._lobby.name}`);
        this.runInitialTerritorySelection();
    }

    /**
     * First game phase: each player has to select their starting territory.
     *
     * To help keeping states and timeout, this function was delegated to the class InitialTerritorySelectionManager.
     */
    private runInitialTerritorySelection() {
        this.setGameStage('selecting starting territory');
        this._initialTerritorySelectionManager.startPlayerTerritorySelection();
        this._initialTerritorySelectionManager.onSelectionFinished = () => this.startGameLoop();
        this._log.trace(`Running initial territory selection`);
    }

    /**
     * To be called AFTER the initial territory selection, when the game is actually ready to start.
     *
     * We'll dispatch the call to the TurnManager, the class that will deal with pretty much all the game.
     */
    private startGameLoop() {
        this._turnManager.startFirstTurn();
        this._log.trace(`Starting the actual game`);
    }

    /**
     * Sets the new game stage and updates all players in the lobby.
     *
     * @param gs New Game Stage.
     */
    private setGameStage(gs: GameStage) {
        this._stage = gs;
        new ServerPacketUpdateGameStage(gs).dispatch(...this._players);
    }

    get initialGameStatePacket(): InitialGameStatePacket {
        return {
            territory_graph: this.board.asGraphTerritoryPacket,
            players: this._players.map(
                p =>
                    <GameStatePlayerInfo>{
                        name: p.username,
                        play_order: this._players.indexOf(p),
                        party: p.party.protocolValue,
                        is_lobby_owner: p === this._owner,
                    },
            ),
        };
    }

    get players() {
        return this._players;
    }

    get stage() {
        return this._stage;
    }
}
