import { LobbyPlayer } from '../../../game/player/lobby-player';
import { PacketListener } from '../packet-listener';

export class PLDeselectParty extends PacketListener {
	register(): void {
		this._data.socket.on('deselectCurrentParty', () => {
			if (!(this._data.player instanceof LobbyPlayer)) return;
			this._data.player.lobby?.deselectPlayerParty(this._data.player);
		});
	}
}
