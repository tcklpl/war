import { ConfigManager } from "../config/config_manager";
import { CryptManager } from "../crypt/crypt_manager";
import svlog from "../utils/logging_utils";
import { PlayerManager } from "./player/player_manager";
import { LobbyManager } from "./lobby/lobby_manager";

export class GameServer {

    private _playerManager = new PlayerManager();
    private _lobbyManager!: LobbyManager;

    constructor (private _configManager: ConfigManager, private _cryptManager: CryptManager) {}

    async initialize() {
        svlog.log("Game server started");
        this._lobbyManager = new LobbyManager(this._configManager);
    }

    get playerManager() {
        return this._playerManager;
    }

    get lobbyManager() {
        return this._lobbyManager;
    }
    
}