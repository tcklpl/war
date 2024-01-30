import { ConfigManager } from "../../config/config_manager";
import { CfgServer } from "../../config/default/cfg_server";
import { OverLimitError } from "../../exceptions/over_limit_error";
import { Player } from "../player/player";
import { Lobby } from "./lobby";

export class LobbyManager {

    private _lobbies: Lobby[] = [];
    private _maxLobbies: number;

    constructor(private _configManager: ConfigManager) {
        this._maxLobbies = this._configManager.getConfig(CfgServer).max_lobbies;
    }

    createLobby(owner: Player, name: string, joinable: boolean) {
        if (this._lobbies.length >= this._maxLobbies) throw new OverLimitError();
        const lobby = new Lobby(owner, name);
        lobby.joinable = joinable;
        this._lobbies.push(lobby);
        return lobby;
    }

    removeLobby(lobby: Lobby) {
        this._lobbies = this._lobbies.filter(l => l !== lobby);
    }

    get lobbies() {
        return this._lobbies;
    }

}