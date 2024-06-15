import { LobbyPlayer } from '../../../game/player/lobby_player';
import { PacketListener } from '../packet_listener';

export class PLSelectParty extends PacketListener {
    register(): void {
        this._data.socket.on('selectParty', party => {
            if (!(this._data.player instanceof LobbyPlayer)) return;
            this._data.player.lobby?.setPlayerParty(this._data.player, party);
        });
    }
}
