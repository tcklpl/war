import type { LobbyCreationFailReason } from ':protocol';
import { OverLimitError } from '../../../exceptions/over-limit-error';
import { PlayerAlreadyOwnsALobbyError } from '../../../exceptions/player-already-owns-a-lobby-error';
import { UnavailableNameError } from '../../../exceptions/unavailable-name-error';
import { LobbyPlayer } from '../../../game/player/lobby-player';
import { ServerPacketFailedToCreateLobby } from '../../packet/lobby/failed-to-create-lobby';
import { ServerPacketJoinedLobby } from '../../packet/lobby/joined-lobby';
import { PacketListener } from '../packet-listener';

export class PLCreateLobby extends PacketListener {
	register(): void {
		this._data.socket.on('createLobby', (name, joinable) => {
			if (!(this._data.player instanceof LobbyPlayer)) return;
			try {
				const lobby = this._data.gameServer.lobbyManager.createLobby(this._data.player, name, joinable);
				new ServerPacketJoinedLobby(lobby).dispatch(this._data.player);
				this._data.player.joinLobby(lobby);
			} catch (e) {
				let errorReason: LobbyCreationFailReason;
				if (e instanceof OverLimitError) {
					this._data.logger.warn(
						`${this._data.player.username} failed to create lobby "${name}": The max numbers of lobbies was reached`,
					);
					errorReason = 'full';
				} else if (e instanceof UnavailableNameError) {
					this._data.logger.warn(
						`${this._data.player.username} failed to create lobby "${name}": This lobby name is already in use`,
					);
					errorReason = 'unavailable name';
				} else if (e instanceof PlayerAlreadyOwnsALobbyError) {
					this._data.logger.warn(
						`${this._data.player.username} failed to create lobby "${name}": ${this._data.player.username} already owns a lobby`,
					);
					errorReason = 'already owner';
				} else {
					this._data.logger.error(
						`${this._data.player.username} failed to create lobby "${name}": Unknown error`,
					);
					errorReason = 'other';
				}
				new ServerPacketFailedToCreateLobby(errorReason).dispatch(this._data.player);
			}
		});
	}
}
