import { LobbyPlayer } from '../../../game/player/lobby-player';
import { ServerPacketUpdateLobbyState } from '../../packet/lobby/update-lobby-state';
import { PacketListener } from '../packet-listener';

export class PLModifyLobbyState extends PacketListener {
	register(): void {
		this._data.socket.on('modifyLobbyState', newState => {
			if (!(this._data.player instanceof LobbyPlayer)) return;
			const lobby = this._data.player.lobby;
			if (!lobby) return;
			if (lobby.owner !== this._data.player) return;
			lobby.replaceLobbyState(newState);
			new ServerPacketUpdateLobbyState(lobby).dispatch(...lobby.players);
			this._data.gameServer.lobbyManager.updateLobbyStatusForPlayers();
		});
	}
}
