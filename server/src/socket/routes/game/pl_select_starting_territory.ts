import { GamePlayer } from '../../../game/player/game_player';
import { PacketListener } from '../packet_listener';

export class PLSelectStartingTerritory extends PacketListener {
    register(): void {
        this._data.socket.on('gSelectStartingTerritory', code => {
            if (!(this._data.player instanceof GamePlayer)) return;
            this._data.player.game.onPlayerAction('select initial territory', code, this._data.player);
        });
    }
}
