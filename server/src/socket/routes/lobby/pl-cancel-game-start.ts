import { LobbyPlayer } from '../../../game/player/lobby-player';
import { PacketListener } from '../packet-listener';

export class PLCancelGameStart extends PacketListener {
	register(): void {
		this._data.socket.on('lCancelGameStart', () => {
			if (!(this._data.player instanceof LobbyPlayer)) return;
			if (!this._data.player.lobby) return;
			if (this._data.player.lobby.owner !== this._data.player) return;
			this._data.player.lobby.cancelGameStart();
		});
	}
}
