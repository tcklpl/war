import { Game } from '../ingame/game';
import { Party } from '../party/party';
import { LobbyPlayer } from './lobby_player';
import { Player } from './player';
import { PlayerConnection } from './player_connection';

export class GamePlayer extends Player {
    constructor(
        _username: string,
        _connection: PlayerConnection,
        private readonly _party: Party,
        private readonly _game: Game,
    ) {
        super(_username, _connection);
    }

    transformIntoLobbyPlayer() {
        const lobbyPlayer = new LobbyPlayer(this.username, this.connection);
        lobbyPlayer.packetListeners = this.packetListeners;
        this.packetListeners.updatePlayerInstance(lobbyPlayer);
        return lobbyPlayer;
    }

    get party() {
        return this._party;
    }

    get game() {
        return this._game;
    }
}
