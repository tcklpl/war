import { Lobby } from '../lobby/lobby';
import { Party } from '../party/party';
import { PartyNotSet } from '../party/not_set';
import { Player } from './player';
import { Game } from '../ingame/game';
import { PlayerPartyNotSetError } from '../../exceptions/game_start/player_party_not_set_error';
import { GamePlayer } from './game_player';

export class LobbyPlayer extends Player {
    private _lobby?: Lobby;
    party: Party = new PartyNotSet();

    joinLobby(lobby: Lobby) {
        this._lobby = lobby;
        this._lobby.addPlayer(this);
    }

    leaveCurrentLobby() {
        this._lobby?.removePlayer(this);
        this._lobby = undefined;
        this.party = new PartyNotSet();
    }

    transformIntoGamePlayer(game: Game) {
        if (!this.party || this.party instanceof PartyNotSet) throw new PlayerPartyNotSetError(game, this);
        const gamePlayer = new GamePlayer(this.username, this.connection, this.party, game);
        gamePlayer.packetListeners = this.packetListeners;
        this.packetListeners.updatePlayerInstance(gamePlayer);
        return gamePlayer;
    }

    get lobby() {
        return this._lobby;
    }
}
