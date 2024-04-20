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
import { PLStartGame } from "./lobby/pl_start_game"
import { PLCancelGameStart } from "./lobby/pl_cancel_game_start"
import { PLGameAction } from "./game/pl_game_action"
import { PLSelectStartingTerritory } from "./game/pl_select_starting_territory"
import { Logger } from "../../log/logger"
import { PLPing } from "./game/pl_ping"


export const registerPacketListeners = (data: SocketRouteData, logger: Logger) => {
    return [
        // Lobby list
        new PLCreateLobby(data, logger),
        new PLJoinLobby(data, logger),
        new PLRequestLobbies(data, logger),

        // Lobby
        new PLChatMessage(data, logger),
        new PLSelectParty(data, logger),
        new PLLeaveLobby(data, logger),
        new PLDeselectParty(data, logger),
        new PLKickPlayer(data, logger),
        new PLModifyLobbyState(data, logger),
        new PLTransferLobbyOwnership(data, logger),
        new PLStartGame(data, logger),
        new PLCancelGameStart(data, logger),

        // Game
        new PLPing(data, logger),
        new PLSelectStartingTerritory(data, logger),
        new PLGameAction(data, logger),
    ]
}