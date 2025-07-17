import { LobbyPlayer } from '../../../game/player/lobby-player';
import { PacketListener } from '../packet-listener';

export class PLChatMessage extends PacketListener {
	register(): void {
		this._data.socket.on('sendChatMessage', msg => {
			if (!(this._data.player instanceof LobbyPlayer)) return;
			this._data.player.lobby?.broadcastChatMessage(this._data.player, msg);
		});
	}
}
