import { LobbyState, LobbyPlayerState, GameConfig, GameParty, LobbyStage } from '../../../../protocol';
import { Logger } from '../../log/logger';
import { ServerPacketInitialGameState } from '../../socket/packet/game/initial_game_state';
import { ServerPacketChatMessage } from '../../socket/packet/lobby/chat_message';
import { ServerPacketGameStartCancelled } from '../../socket/packet/lobby/game_start_cancelled';
import { ServerPacketStartingGame } from '../../socket/packet/lobby/starting_game';
import { ServerPacketUpdateLobbyState } from '../../socket/packet/lobby/update_lobby_state';
import { GameManager } from '../ingame/game_manager';
import { PartyAnarchism } from '../party/anarchism';
import { PartyCapitalism } from '../party/capitalism';
import { PartyFeudalism } from '../party/feudalism';
import { PartyNotSet } from '../party/not_set';
import { Party } from '../party/party';
import { PartySocialism } from '../party/socialism';
import { LobbyPlayer } from '../player/lobby_player';
import { LobbyManager } from './lobby_manager';

export class Lobby {
    private _stage: LobbyStage = 'in lobby';
    private _players: LobbyPlayer[] = [];
    joinable = true;
    private _parties: Party[] = [
        new PartyAnarchism(),
        new PartyFeudalism(),
        new PartySocialism(),
        new PartyCapitalism(),
    ];

    private _startGameTask?: NodeJS.Timeout;

    constructor(
        private _owner: LobbyPlayer,
        private _name: string,
        private _gameConfig: GameConfig,
        private _gameStartCountdown: number,
        private _lobbyManager: LobbyManager,
        private _gameManager: GameManager,
        private _log: Logger,
    ) {
        this._players.push(this.owner);
    }

    addPlayer(p: LobbyPlayer) {
        if (!this._players.find(x => x === p)) {
            this._players.push(p);
            new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
            this._log.info(`Player ${p.username} has joined the lobby`);
        }
    }

    removePlayer(p: LobbyPlayer) {
        this._players = this._players.filter(x => x !== p);
        if (p === this._owner && this._players.length > 0) {
            this._owner = this._players[0];
        }
        if (p.party) {
            p.party.player = undefined;
            p.party = new PartyNotSet();
        }
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
        this._log.info(`Player ${p.username} has left the lobby`);
        // will cancel any ongoing game start. This function will do nothing if the game isn't starting
        this.cancelGameStart();
    }

    removeAllPlayers() {
        this._players.forEach(p => p.leaveCurrentLobby());
    }

    broadcastChatMessage(sender: LobbyPlayer, msg: string) {
        new ServerPacketChatMessage(sender, msg).dispatch(...this._players);
    }

    changeOwnership(newOwner: LobbyPlayer) {
        if (this._stage !== 'in lobby') return;
        if (!this._players.find(p => p === newOwner)) return;

        this._log.info(`Lobby ownership changed from ${this._owner.username} to ${newOwner.username}`);
        this._owner = newOwner;
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
    }

    replaceLobbyState(state: LobbyState) {
        if (this._stage !== 'in lobby') return;

        this.joinable = state.joinable;
        if (!this._gameConfig.is_immutable) {
            this._gameConfig = state.game_config;
        }
    }

    setPlayerParty(player: LobbyPlayer, protocolParty: GameParty) {
        if (this._stage !== 'in lobby') return;

        const party = this._parties.find(p => p.protocolValue === protocolParty);
        if (!party || !(player.party instanceof PartyNotSet) || party.player) return;
        player.party = party;
        party.player = player;
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
        this._log.debug(`${player.username} selected the party ${protocolParty}`);
    }

    deselectPlayerParty(player: LobbyPlayer) {
        if (this._stage !== 'in lobby') return;

        player.party = new PartyNotSet();
        this._parties.filter(p => p.player === player).forEach(p => (p.player = undefined));
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
        this._log.debug(`${player.username} deselected their current party`);
    }

    startGame() {
        // validate if all players have selected a party
        if (this._players.some(p => p.party instanceof PartyNotSet)) return false;
        new ServerPacketStartingGame(this._gameStartCountdown).dispatch(...this._players);
        this._stage = 'starting';

        // set a timeout to actually start the game
        this._startGameTask = setTimeout(() => {
            const game = this._gameManager.consummateLobbyIntoGame(this, this._log.createChildContext('In Game'));
            new ServerPacketInitialGameState(game.generateInitialGameStatePacket()).dispatch(...this._players);
            game.setupGame();
        }, this._gameStartCountdown * 1000);

        this._log.info(`Starting game`);
        return true;
    }

    cancelGameStart() {
        if (this._startGameTask) {
            clearTimeout(this._startGameTask);
            this._stage = 'in lobby';
            new ServerPacketGameStartCancelled().dispatch(...this._players);
            this._log.info(`Game start cancelled`);
        }
    }

    cleanup() {
        this.cancelGameStart();
        this.removeAllPlayers();
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

    get gameConfig() {
        return this._gameConfig;
    }

    get stage() {
        return this._stage;
    }

    get asProtocolLobbyState(): LobbyState {
        return {
            name: this._name,
            joinable: this.joinable,
            players: this._players.map(
                p =>
                    <LobbyPlayerState>{
                        name: p.username,
                        is_lobby_owner: p === this._owner,
                        party: p.party?.protocolValue,
                    },
            ),
            game_config: this._gameConfig,
            selectable_parties: this._parties.filter(p => !p.player).map(p => p.protocolValue),
        };
    }
}
