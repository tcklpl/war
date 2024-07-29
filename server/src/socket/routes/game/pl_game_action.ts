import { GamePlayer } from '../../../game/player/game_player';
import { PacketListener } from '../packet_listener';

export class PLGameAction extends PacketListener {
    register(): void {
        this._data.socket.on('gGameAction', action => {
            if (!(this._data.player instanceof GamePlayer)) return;
            this._data.player.game.onPlayerAction('game action', action, this._data.player);
        });
    }
}
