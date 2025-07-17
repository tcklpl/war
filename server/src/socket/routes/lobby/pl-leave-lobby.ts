import { CfgServer } from '../../../config/default/cfg-server';
import { LobbyPlayer } from '../../../game/player/lobby-player';
import { ServerPacketLeftLobby } from '../../packet/lobby/left-lobby';
import { ServerPacketLobbies } from '../../packet/lobby/lobbies';
import { PacketListener } from '../packet-listener';

export class PLLeaveLobby extends PacketListener {
	register(): void {
		this._data.socket.on('leaveLobby', () => {
			if (!(this._data.player instanceof LobbyPlayer)) return;
			this._data.player.leaveCurrentLobby();
			this._data.gameServer.lobbyManager.purgeEmptyLobbies();
			new ServerPacketLeftLobby().dispatch(this._data.player);

			// also send an updated lobby state package to the player, as they'll be back to the lobby selection screen
			new ServerPacketLobbies(
				this._data.gameServer.lobbyManager,
				this._data.configManager.getConfig(CfgServer),
			).dispatch(this._data.player);
		});
	}
}
