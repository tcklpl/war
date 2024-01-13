import { ConfigManager } from "../config/config_manager";
import { CryptManager } from "../crypt/crypt_manager";
import svlog from "../utils/logging_utils";
import { Player } from "./player/player";

export class GameServer {

    private _loggedPlayers: Player[] = [];

    constructor (private _configManager: ConfigManager, private _cryptManager: CryptManager) {}

    isUsernameAvailable(username: string) {
        return !this._loggedPlayers.find(x => x.username === username);
    }

    loginPlayer(player: Player) {
        if (!this.isUsernameAvailable(player.username)) throw new Error(`Trying to login player with unavailable username "${player.username}"`);
        this._loggedPlayers.push(player);
        svlog.log(`${player.username} logged in. (from ${player.ip})`);
    }

    logoffPlayer(player?: Player) {
        if (!player) return;
        this._loggedPlayers = this._loggedPlayers.filter(x => x.username !== player.username);
        svlog.log(`${player.username} logged off`);
    }

    getPlayerByName(name: string): Player | undefined {
        return this._loggedPlayers.find(x => x.username === name);
    }

    async initialize() {
        svlog.log("Game server started")
    }

    get loggedPlayers() {
        return this._loggedPlayers;
    }
}