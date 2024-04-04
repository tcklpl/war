import { LobbyCreationFailReason } from "../../../../../protocol";
import { OverLimitError } from "../../../exceptions/over_limit_error";
import { PlayerAlreadyOwnsALobbyError } from "../../../exceptions/player_already_owns_a_lobby_error";
import { UnavailableNameError } from "../../../exceptions/unavailable_name_error";
import svlog from "../../../utils/logging_utils";
import { ServerPacketFailedToCreateLobby } from "../../packet/lobby/failed_to_create_lobby";
import { ServerPacketJoinedLobby } from "../../packet/lobby/joined_lobby";
import { PacketListener } from "../packet_listener";

export class PLCreateLobby extends PacketListener {

    register(): void {
        this._data.socket.on("createLobby", (name, joinable) => {
        
            try {
    
                const lobby = this._data.gameServer.lobbyManager.createLobby(this._data.player, name, joinable);
                svlog.info(`${this._data.player.username} created lobby "${name}" (current lobbies: ${this._data.gameServer.lobbyManager.lobbies.length} / ${this._data.gameServer.lobbyManager.maxLobbies})`);
                new ServerPacketJoinedLobby(lobby).dispatch(this._data.player);
                
            } catch (e) {
    
                let errorReason: LobbyCreationFailReason;
                if (e instanceof OverLimitError) {
                    svlog.info(`${this._data.player.username} failed to create lobby "${name}": The max numbers of lobbies was reached`);
                    errorReason = "full";
                }
                else if (e instanceof UnavailableNameError) {
                    svlog.info(`${this._data.player.username} failed to create lobby "${name}": This lobby name is already in use`);
                    errorReason = "unavailable name";
                }
                else if (e instanceof PlayerAlreadyOwnsALobbyError) {
                    svlog.info(`${this._data.player.username} failed to create lobby "${name}": ${this._data.player.username} already owns a lobby`);
                    errorReason = "already owner";
                }
                else {
                    svlog.err(`${this._data.player.username} failed to create lobby "${name}": Unknown error`);
                    errorReason = "other";
                }
                new ServerPacketFailedToCreateLobby(errorReason).dispatch(this._data.player);
    
            }
    
        });
    }
}