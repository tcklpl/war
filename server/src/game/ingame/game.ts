import {
    type GamePauseReason,
    type GameSessionConnectionInfo,
    type GameStage,
    type GameStatePlayerInfo,
    type InitialGameStatePacket,
    type PrematureGameEndReason,
    type TerritoryCode,
    type TurnAction,
} from '../../../../protocol';
import { CryptManager } from '../../crypt/crypt_manager';
import { LobbyNotReadyError } from '../../exceptions/lobby_not_ready_error';
import { LobbyMovedOnError } from '../../exceptions/reconnection/lobby_moved_on_error';
import { PlayerAlreadyInLobbyError } from '../../exceptions/reconnection/player_already_in_lobby_error';
import { PlayerDoesntBelongOnLobbyError } from '../../exceptions/reconnection/player_doesnt_belong_on_lobby_error';
import { Logger } from '../../log/logger';
import { GameSaveService } from '../../persistence/service/game_save_service';
import { SvPktGGamePaused } from '../../socket/packet/game/game_paused';
import { SvPktGGameResumed } from '../../socket/packet/game/game_resumed';
import { SvPktGGameSaved } from '../../socket/packet/game/game_saved';
import { ServerPacketGameSessionConnectionToken } from '../../socket/packet/game/game_session_connection_token';
import { ServerPacketInitialGameState } from '../../socket/packet/game/initial_game_state';
import { SvPktGPlayerDisconnected } from '../../socket/packet/game/player_disconnected';
import { SvPktGPlayerReconnected } from '../../socket/packet/game/player_reconnected';
import { SvPktGPrematureGameEnd } from '../../socket/packet/game/premature_game_end';
import { ServerPacketUpdateGameStage } from '../../socket/packet/game/update_game_stage';
import { Board } from '../board/board';
import { Lobby } from '../lobby/lobby';
import { GamePlayer } from '../player/game_player';
import { Player } from '../player/player';
import { PlayerManager } from '../player/player_manager';
import { GameManager } from './game_manager';
import { InitialTerritorySelectionManager } from './initial_territory_selection_manager';
import { TurnManager } from './turn_manager';

export class Game {
    // basic state
    readonly id = crypto.randomUUID();
    private readonly _players: GamePlayer[];
    private _owner!: GamePlayer;
    private _stage: GameStage = 'starting';
    private _pauseReason?: GamePauseReason;

    // game managers
    private readonly _board: Board;
    private readonly _turnManager: TurnManager;
    private readonly _initialTerritorySelectionManager: InitialTerritorySelectionManager;

    constructor(
        private readonly _lobby: Lobby,
        private readonly _gameManager: GameManager,
        private readonly _cryptManager: CryptManager,
        private readonly _playerManager: PlayerManager,
        private readonly _gameSaveService: GameSaveService,
        private readonly _log: Logger,
    ) {
        if (_lobby.players.some(p => !p.party)) throw new LobbyNotReadyError();

        const consummatedPlayers = _lobby.players.map(p => {
            const consummated = p.transformIntoGamePlayer(this);
            this._playerManager.switchPlayerInstance(p, consummated);
            if (_lobby.owner === p) this._owner = consummated;
            return consummated;
        });

        // shuffle the player list, this will be the play order
        this._players = consummatedPlayers.sort(() => Math.random() - 0.5);

        this._board = new Board(this._log.createChildContext('Board'));
        this._initialTerritorySelectionManager = new InitialTerritorySelectionManager(
            this,
            this._log.createChildContext('Initial Territory Selection'),
        );

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
        this.dispatchConnectionTokens();
        this.runInitialTerritorySelection();
    }

    async saveGame() {
        this._log.debug(`Saving game ${this.id}`);
        await this._gameSaveService.save(this);
        new SvPktGGameSaved().dispatch(...this.players);
    }

    private pauseGame(reason: GamePauseReason) {
        this._pauseReason = reason;
        new SvPktGGamePaused(reason).dispatch(...this.players);

        if (this.stage === 'selecting starting territory') {
            this._initialTerritorySelectionManager.pauseSelection();
        }
    }

    private resumeGame() {
        if (!this._pauseReason) {
            this._log.warn(`Trying to resume a game that isn't paused`);
            return;
        }
        this._pauseReason = undefined;
        if (this.stage === 'selecting starting territory') {
            this._initialTerritorySelectionManager.resumeSelection();
        }

        new SvPktGGameResumed().dispatch(...this.players);
    }

    /**
     * Closes the room early and removes it from the game manager.
     *
     * ! This function is only meant to be called when an early end is needed.
     * ! Does NOT save the game.
     *
     * @param reason Reason to close the room, defined in the protocol.
     */
    closeRoomEarly(reason: PrematureGameEndReason) {
        // Clear territory selection timeouts if we're in this stage
        if (this.stage === 'selecting starting territory') {
            this._initialTerritorySelectionManager.pauseSelection();
        }
        new SvPktGPrematureGameEnd(reason).dispatch(...this.players);
        this._gameManager.removeGame(this);
    }

    /**
     * Marks all disconnected players as discarded and resumes the game.
     */
    moveOnGame() {
        if (!this._pauseReason) {
            this._log.warn(`Trying to move on game a game that isn't paused`);
            return;
        }
        const disconnectedPlayers = this._players.filter(p => p.online && !p.discarded);
        if (disconnectedPlayers.length === 0) {
            this._log.warn(`Trying to move on lobby with no disconnected non-discarded players`);
            return;
        }
        const remainingOnlinePlayers = this._players.filter(p => p.online);
        if (remainingOnlinePlayers.length === 0) {
            this._log.warn(`Trying to move on lobby that would end up having no online players`);
            return;
        }
        disconnectedPlayers.forEach(p => (p.discarded = true));
        this.resumeGame();
    }

    reconnectPlayer(p: Player) {
        const previousConnection = this._players.find(lp => lp.username === p.username);
        if (!previousConnection) throw new PlayerDoesntBelongOnLobbyError();
        if (previousConnection.online) throw new PlayerAlreadyInLobbyError();
        if (previousConnection.discarded) throw new LobbyMovedOnError();

        p.morphInto(previousConnection);
        this._playerManager.switchPlayerInstance(p, previousConnection);
        previousConnection.online = true;

        new ServerPacketInitialGameState(this.generateInitialGameStatePacket()).dispatch(p);
        new SvPktGPlayerReconnected(previousConnection).dispatch(...this.players);

        const allPlayersOnline = !this.players.find(x => !x.online);
        if (allPlayersOnline) {
            this.resumeGame();
        }

        this._log.info(`${p.username} has rejoined the game ${this.id}`);
        return this.generateGameSessionConnectionTokenForPlayer(previousConnection);
    }

    onPlayerLeave(player: GamePlayer) {
        player.online = false;
        player.unregisterPacketListeners();
        this._log.info(`${player.username} has left the game ${this.id}`);
        this.saveGame();

        if (this.isOwner(player)) {
            new SvPktGPrematureGameEnd('owner left').dispatch(...this.players);
            return;
        }

        new SvPktGPlayerDisconnected(player).dispatch(...this.players);
        this.pauseGame('player disconnected');
    }

    ownerPausedGame() {
        this.pauseGame('owner paused');
    }

    ownerResumedGame() {
        if (!this._pauseReason) {
            this._log.warn(`Trying to manually resume a game that wasn't paused`);
            return;
        }
        if (this._pauseReason !== 'owner paused') {
            this._log.warn(`Trying to manually resume a game that wasn't paused by the owner`);
            return;
        }
        this.resumeGame();
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

    isOwner(p: GamePlayer) {
        return p === this._owner;
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

    /**
     * Generates and dispatches connection tokens for all players in a lobby.
     * These token can be used to reconnect to the game.
     */
    private dispatchConnectionTokens() {
        this._players.forEach(p => {
            new ServerPacketGameSessionConnectionToken(this.generateGameSessionConnectionTokenForPlayer(p)).dispatch(p);
        });
    }

    generateInitialGameStatePacket(): InitialGameStatePacket {
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

    generateGameSessionConnectionTokenForPlayer(p: Player) {
        return this._cryptManager.signTokenBody(<GameSessionConnectionInfo>{
            game_id: this.id,
            username: p.username,
        });
    }

    get board() {
        return this._board;
    }

    get players() {
        return this._players;
    }

    get stage() {
        return this._stage;
    }
}
