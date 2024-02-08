import { GameConfig } from "../../../../protocol";
import { ConfigManager } from "../../config/config_manager";
import { CfgGame } from "../../config/default/cfg_game";
import { CfgServer } from "../../config/default/cfg_server";
import { OverLimitError } from "../../exceptions/over_limit_error";
import { PlayerAlreadyOwnsALobbyError } from "../../exceptions/player_already_owns_a_lobby_error";
import { UnavailableNameError } from "../../exceptions/unavailable_name_error";
import { ServerPacketLobbies } from "../../socket/packet/lobby/lobbies";
import svlog from "../../utils/logging_utils";
import { GameServer } from "../game_server";
import { Player } from "../player/player";
import { PlayerStatus } from "../player/player_status";
import { Lobby } from "./lobby";

export class LobbyManager {

    private _lobbies: Lobby[] = [];
    private _maxLobbies: number;
    private readonly _defaultGameConfig: GameConfig;

    constructor(private _configManager: ConfigManager, private _gameServer: GameServer) {
        this._maxLobbies = this._configManager.getConfig(CfgServer).max_lobbies;
        this._defaultGameConfig = _configManager.getConfig(CfgGame).default_game_config;
        this.registerEvents();
    }

    async stop() {
        this._lobbies.forEach(l => l.removeAllPlayers());
    }

    private updateLobbyStatusForPlayers() {
        const lobbyPlayers = this._gameServer.playerManager.getPlayersByStatus(PlayerStatus.IN_LOBBY_LIST);
        new ServerPacketLobbies(this._gameServer.lobbyManager, this._configManager.getConfig(CfgServer)).dispatch(...lobbyPlayers);
    }

    private registerEvents() {
        this._gameServer.playerManager.onPlayerLogoff(p => {
            // we can call this for all the lobbies because they'll just ignore removing a player that isn't in the lobby
            this._lobbies.forEach(l => l.removePlayer(p));
            this.purgeEmptyLobbies();
        });
    }

    purgeEmptyLobbies() {
        const toPurge = this._lobbies.filter(l => l.players.length === 0);
        toPurge.forEach(p => {
            this.removeLobby(p);
            svlog.log(`Lobby "${p.name}" was removed (reason: empty)`);
        });
        this.updateLobbyStatusForPlayers();
    }

    createLobby(owner: Player, name: string, joinable: boolean) {
        if (this._lobbies.length >= this._maxLobbies) throw new OverLimitError();
        if (this._lobbies.find(l => l.name === name)) throw new UnavailableNameError();
        if (this._lobbies.find(l => l.owner === owner)) throw new PlayerAlreadyOwnsALobbyError();

        const lobby = new Lobby(owner, name, {...this._defaultGameConfig});
        owner.joinLobby(lobby);
        lobby.joinable = joinable;
        this._lobbies.push(lobby);
        this.updateLobbyStatusForPlayers();
        return lobby;
    }

    removeLobby(lobby: Lobby) {
        this._lobbies = this._lobbies.filter(l => l !== lobby);
        this.updateLobbyStatusForPlayers();
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