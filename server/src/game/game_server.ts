import { ConfigManager } from "../config/config_manager";
import { CryptManager } from "../crypt/crypt_manager";
import svlog from "../utils/logging_utils";
import { PlayerManager } from "./player/player_manager";
import { GameRoomManager } from "./room/game_room_manager";

export class GameServer {

    private _playerManager = new PlayerManager();
    private _gameRoomManager!: GameRoomManager;

    constructor (private _configManager: ConfigManager, private _cryptManager: CryptManager) {}

    async initialize() {
        svlog.log("Game server started");
        this._gameRoomManager = new GameRoomManager(this._configManager);
    }

    get playerManager() {
        return this._playerManager;
    }

    get gameRoomManager() {
        return this._gameRoomManager;
    }
    
}