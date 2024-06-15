import { CfgServer } from '../../../config/default/cfg_server';
import { LobbyPlayer } from '../../../game/player/lobby_player';
import { ServerPacketLobbies } from '../../packet/lobby/lobbies';
import { PacketListener } from '../packet_listener';

export class PLRequestLobbies extends PacketListener {
    register(): void {
        this._data.socket.on('requireLobbies', () => {
            if (!(this._data.player instanceof LobbyPlayer)) return;
            const packet = new ServerPacketLobbies(
                this._data.gameServer.lobbyManager,
                this._data.configManager.getConfig(CfgServer),
            );
            packet.dispatch(this._data.player);
        });
    }
}
