import { LobbyPlayer } from '../../../game/player/lobby_player';
import { PacketListener } from '../packet_listener';

export class PLDeselectParty extends PacketListener {
    register(): void {
        this._data.socket.on('deselectCurrentParty', () => {
            if (!(this._data.player instanceof LobbyPlayer)) return;
            this._data.player.lobby?.deselectPlayerParty(this._data.player);
        });
    }
}
