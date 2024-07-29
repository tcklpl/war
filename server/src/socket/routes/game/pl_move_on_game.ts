import { GamePlayer } from '../../../game/player/game_player';
import { PacketListener } from '../packet_listener';

export class PLGMoveOnGame extends PacketListener {
    register(): void {
        this._data.socket.on('gMoveOn', () => {
            if (!(this._data.player instanceof GamePlayer)) return;

            const playerGame = this._data.player.game;
            if (!playerGame.isOwner(this._data.player)) {
                this._data.logger.warn(
                    `Player ${this._data.player.username} is trying to move on the game ${playerGame.id} without being the owner`,
                );
                return;
            }

            playerGame.moveOnGame();
        });
    }
}
