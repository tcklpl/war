import { Logger } from '../../log/logger';
import { GamePlayer } from './game_player';
import { LobbyPlayer } from './lobby_player';
import { Player } from './player';

export class PlayerManager {
    private _loggedPlayers: Player[] = [];
    private _onPlayerLogoff: ((player: Player) => void)[] = [];

    constructor(private _log: Logger) {}

    isUsernameAvailable(username: string) {
        return !this._loggedPlayers.find(x => x.username === username);
    }

    getPlayersInLobby() {
        return this._loggedPlayers.filter(p => p instanceof LobbyPlayer);
    }

    getPlayersInGame() {
        return this._loggedPlayers.filter(p => p instanceof GamePlayer);
    }

    loginPlayer(player: Player) {
        if (!this.isUsernameAvailable(player.username))
            throw new Error(`Trying to login player with unavailable username "${player.username}"`);
        this._loggedPlayers.push(player);
        this._log.info(`${player.username} logged in. (from ${player.connection.socket.conn.remoteAddress})`);
    }

    logoffPlayer(player?: Player) {
        if (!player) return;
        this._loggedPlayers = this._loggedPlayers.filter(x => x.username !== player.username);
        this._onPlayerLogoff.forEach(l => l(player));
        this._log.info(`${player.username} logged off`);
    }

    getPlayerByName(name: string): Player | undefined {
        return this._loggedPlayers.find(x => x.username === name);
    }

    assertGetPlayerByName(name: string) {
        const result = this.getPlayerByName(name);
        if (!result) throw new Error(`Failed to get player "${name}"`);
        return result;
    }

    onPlayerLogoff(l: (player: Player) => void) {
        this._onPlayerLogoff.push(l);
    }

    get loggedPlayers() {
        return this._loggedPlayers;
    }
}
