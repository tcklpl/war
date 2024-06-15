import { LobbyPlayer } from '../../../game/player/lobby_player';
import { ServerPacketLeftLobby } from '../../packet/lobby/left_lobby';
import { PacketListener } from '../packet_listener';

export class PLKickPlayer extends PacketListener {
    register(): void {
        this._data.socket.on('kickPlayer', player => {
            if (!(this._data.player instanceof LobbyPlayer)) return;
            if (this._data.player.lobby?.owner !== this._data.player) return;

            const playerToBeKicked = this._data.gameServer.playerManager.getPlayerByName(player);
            if (!playerToBeKicked) return;
            if (!(playerToBeKicked instanceof LobbyPlayer)) return;
            if (playerToBeKicked.lobby !== this._data.player.lobby) return;
            playerToBeKicked.leaveCurrentLobby();
            new ServerPacketLeftLobby(true).dispatch(playerToBeKicked);
        });
    }
}
