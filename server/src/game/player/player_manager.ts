import svlog from "../../utils/logging_utils";
import { Player } from "./player";
import { PlayerStatus } from "./player_status";

export class PlayerManager {

    private _loggedPlayers: Player[] = [];
    private _onPlayerLogoff: ((player: Player) => void)[] = [];

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
        this._onPlayerLogoff.forEach(l => l(player));
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

    getPlayersByStatus(status: PlayerStatus) {
        return this._loggedPlayers.filter(p => p.status === status);
    }

    onPlayerLogoff(l: (player: Player) => void) {
        this._onPlayerLogoff.push(l);
    }

    get loggedPlayers() {
        return this._loggedPlayers;
    }

}