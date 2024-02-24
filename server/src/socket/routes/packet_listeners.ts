import { PLChatMessage } from "./lobby/pl_chat_message"
import { PLCreateLobby } from "./lobby_list/pl_create_lobby"
import { PLDeselectParty } from "./lobby/pl_deselect_party"
import { PLJoinLobby } from "./lobby_list/pl_join_lobby"
import { PLKickPlayer } from "./lobby/pl_kick_player"
import { PLLeaveLobby } from "./lobby/pl_leave_lobby"
import { PLModifyLobbyState } from "./lobby/pl_modify_lobby_state"
import { PLRequestLobbies } from "./lobby_list/pl_req_lobbies"
import { PLSelectParty } from "./lobby/pl_select_party"
import { PLTransferLobbyOwnership } from "./lobby/pl_transfer_lobby_ownership"
import { SocketRouteData } from "./socket_route_data"


export const registerPacketListeners = (data: SocketRouteData) => {
    return [
        // Lobby list
        new PLCreateLobby(data),
        new PLJoinLobby(data),
        new PLRequestLobbies(data),

        // Lobby
        new PLChatMessage(data),
        new PLSelectParty(data),
        new PLLeaveLobby(data),
        new PLDeselectParty(data),
        new PLKickPlayer(data),
        new PLModifyLobbyState(data),
        new PLTransferLobbyOwnership(data),
    ]
}