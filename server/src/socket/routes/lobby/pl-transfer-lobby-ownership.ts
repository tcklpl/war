import { LobbyPlayer } from '../../../game/player/lobby-player';
import { PacketListener } from '../packet-listener';

export class PLTransferLobbyOwnership extends PacketListener {
	register(): void {
		this._data.socket.on('transferLobbyOwnership', to => {
			if (!(this._data.player instanceof LobbyPlayer)) return;
			if (this._data.player.lobby?.owner !== this._data.player) return;
			const newLobbyOwner = this._data.gameServer.playerManager.getPlayerByName(to);
			if (!newLobbyOwner) return;
			if (!(newLobbyOwner instanceof LobbyPlayer)) return;
			this._data.player.lobby.changeOwnership(newLobbyOwner);
		});
	}
}
