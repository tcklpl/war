import { LobbyPlayer } from '../../../game/player/lobby-player';
import { PacketListener } from '../packet-listener';

export class PLSelectParty extends PacketListener {
	register(): void {
		this._data.socket.on('selectParty', party => {
			if (!(this._data.player instanceof LobbyPlayer)) return;
			this._data.player.lobby?.setPlayerParty(this._data.player, party);
		});
	}
}
