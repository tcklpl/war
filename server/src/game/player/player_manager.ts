import svlog from "../../utils/logging_utils";
import { Player } from "./player";

export class PlayerManager {

    private _loggedPlayers: Player[] = [];

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

    assertGetPlayerByName(name: string) {
        const result = this.getPlayerByName(name);
        if (!result) throw new Error(`Failed to get player "${name}"`);
        return result;
    }

    get loggedPlayers() {
        return this._loggedPlayers;
    }

}