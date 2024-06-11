import { Game } from '../../game/ingame/game';
import { LobbyPlayer } from '../../game/player/lobby_player';
import { GameStartError } from './game_start_error';

export class PlayerPartyNotSetError extends GameStartError {
    constructor(game: Game, player: LobbyPlayer) {
        super(
            `Trying to consummate a player that didn't pick their party. On game '${game.id}' for player '${player.username}'`,
        );
    }
}
