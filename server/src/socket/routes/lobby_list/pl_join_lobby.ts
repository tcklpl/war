import svlog from "../../../utils/logging_utils";
import { ServerPacketJoinedLobby } from "../../packet/lobby/joined_lobby";
import { PacketListener } from "../packet_listener";

export class PLJoinLobby extends PacketListener {

    register(): void {
        this._data.socket.on("joinLobby", (lobbyName) => {
        
            svlog.log(`${this._data.player.username} is trying to join lobby "${lobbyName}"`);
    
            if (this._data.player.lobby) {
                svlog.log(`${this._data.player.username} failed to join lobby "${lobbyName}": Player is already in a lobby`);
                // TODO: send error
                return;
            }
    
            const lobby = this._data.gameServer.lobbyManager.getLobbyByName(lobbyName);
            if (!lobby) {
                svlog.log(`${this._data.player.username} failed to join lobby "${lobbyName}": Lobby doesn't exist`);
                // TODO: send error
                return;
            }
    
            if (!lobby.joinable) {
                svlog.log(`${this._data.player.username} failed to join lobby "${lobbyName}": Lobby isn't joinable`);
                // TODO: send error
                return;
            }
    
            this._data.player.joinLobby(lobby);
            new ServerPacketJoinedLobby(lobby).dispatch(this._data.player);
            svlog.log(`${this._data.player.username} joined lobby "${lobbyName}"`);
    
        });
    }
}
