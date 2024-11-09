import { ConfigManager } from '../../config/config_manager';
import { CfgGame } from '../../config/default/cfg_game';
import { CfgServer } from '../../config/default/cfg_server';
import { OverLimitError } from '../../exceptions/over_limit_error';
import { PlayerAlreadyOwnsALobbyError } from '../../exceptions/player_already_owns_a_lobby_error';
import { UnavailableNameError } from '../../exceptions/unavailable_name_error';
import { Logger } from '../../log/logger';
import { ServerPacketLobbies } from '../../socket/packet/lobby/lobbies';
import { GameServer } from '../game_server';
import { LobbyPlayer } from '../player/lobby_player';
import { Lobby } from './lobby';

export class LobbyManager {
    private _lobbies: Lobby[] = [];
    private readonly _maxLobbies: number;
    private readonly _cfgGame: CfgGame;

    constructor(
        private readonly _configManager: ConfigManager,
        private readonly _gameServer: GameServer,
        private readonly _log: Logger,
    ) {
        this._maxLobbies = this._configManager.getConfig(CfgServer).max_lobbies;
        this._cfgGame = _configManager.getConfig(CfgGame);
        this.registerEvents();
    }

    async stop() {
        this._lobbies.forEach(l => l.removeAllPlayers());
    }

    updateLobbyStatusForPlayers() {
        const lobbyPlayers = this._gameServer.playerManager.getPlayersInLobby();
        new ServerPacketLobbies(this._gameServer.lobbyManager, this._configManager.getConfig(CfgServer)).dispatch(
            ...lobbyPlayers,
        );
    }

    private registerEvents() {
        this._gameServer.playerManager.onPlayerLogoff(p => {
            // we can call this for all the lobbies because they'll just ignore removing a player that isn't in the lobby
            if (p instanceof LobbyPlayer) {
                this._lobbies.forEach(l => l.removePlayer(p));
            }
            this.purgeEmptyLobbies();
        });
    }

    purgeEmptyLobbies() {
        const toPurge = this._lobbies.filter(l => l.players.length === 0);
        toPurge.forEach(p => {
            this.removeLobby(p);
            this._log.info(`Lobby "${p.name}" was removed (reason: empty)`);
        });
        this.updateLobbyStatusForPlayers();
    }

    createLobby(owner: LobbyPlayer, name: string, joinable: boolean) {
        if (this._lobbies.length >= this._maxLobbies) throw new OverLimitError();
        if (this._lobbies.find(l => l.name === name)) throw new UnavailableNameError();
        if (this._lobbies.find(l => l.owner === owner)) throw new PlayerAlreadyOwnsALobbyError();

        const lobby = new Lobby(
            owner,
            name,
            { ...this._cfgGame.default_game_config },
            this._cfgGame.game_start_countdown_seconds,
            this._gameServer.gameManager,
            this._log.createChildContext(name),
        );
        lobby.joinable = joinable;
        this._lobbies.push(lobby);
        this.updateLobbyStatusForPlayers();
        this._log.info(
            `${owner.username} created lobby "${name}" (current lobbies: ${this.lobbies.length} / ${this.maxLobbies})`,
        );
        return lobby;
    }

    /**
     * Removes the lobby and notifies all players: kicking those still in the lobby and sending a new lobby list packet
     * to all players in the lobby selection screen.
     *
     * @param lobby The lobby to be removed.
     */
    removeLobby(lobby: Lobby) {
        lobby.cleanup();
        this.dropLobby(lobby);
        this.updateLobbyStatusForPlayers();
    }

    /**
     * Drops the lobby form the manager, without further checks or updates.
     * ! This function will not update connected players that the lobby has been removed.
     *
     * * To be used only by the GameManager when consummating a lobby into the game, so that we don't have duplicates of the same lobby
     * @param lobby The lobby to be dropped.
     */
    dropLobby(lobby: Lobby) {
        this._lobbies = this._lobbies.filter(l => l !== lobby);
    }

    getLobbyByName(name: string) {
        return this._lobbies.find(x => x.name === name);
    }

    get lobbies() {
        return this._lobbies;
    }

    get maxLobbies() {
        return this._maxLobbies;
    }
}
