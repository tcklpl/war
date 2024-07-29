import { GamePlayer } from '../../../game/player/game_player';
import { PacketListener } from '../packet_listener';

export class PLGSaveAndQuit extends PacketListener {
    register(): void {
        this._data.socket.on('gSaveAndQuit', async () => {
            if (!(this._data.player instanceof GamePlayer)) return;

            const playerGame = this._data.player.game;
            if (!playerGame.isOwner(this._data.player)) {
                this._data.logger.warn(
                    `Player ${this._data.player.username} is trying to save and quit the game ${playerGame.id} without being the owner`,
                );
                return;
            }

            await playerGame.saveGame();
            playerGame.closeRoomEarly('room closed');
        });
    }
}
