import { GameSocket } from '../../../../../@types/socket';
import { WarServer } from '../../../war_server';
import { PLInitialGameState } from './game/pl_initial_game_state';
import { PLChat } from './lobby/pl_chat';
import { PLGameStartCancelled } from './lobby/pl_game_start_cancelled';
import { PLJoinedLobby } from './lobby/pl_joined_lobby';
import { PLLeftLobby } from './lobby/pl_left_lobby';
import { PLLobbies } from './lobby_list/pl_lobbies';
import { PLStartingGame } from './lobby/pl_starting_game';
import { PLUpdateLobbyState } from './lobby/pl_update_lobby_state';
import { PLGameConnectionToken } from './game/pl_game_connection_token';
import { PLGamePaused } from './game/pl_game_paused';
import { PLGameResumed } from './game/pl_game_resumed';
import { PLGameSaved } from './game/pl_game_saved';
import { PLPlayerDisconnected } from './game/pl_player_disconnected';
import { PLPlayerReconnected } from './game/pl_player_reconnected';
import { PLPrematureGameEnd } from './game/pl_premature_game_end';

export const registerPacketListeners = (socket: GameSocket, server: WarServer) => {
    return [
        // lobby list
        new PLLobbies(socket, server),

        // lobby
        new PLJoinedLobby(socket, server),
        new PLLeftLobby(socket, server),
        new PLUpdateLobbyState(socket, server),
        new PLChat(socket, server),
        new PLStartingGame(socket, server),
        new PLGameStartCancelled(socket, server),

        // game
        new PLInitialGameState(socket, server),
        // TODO: gUpdateGameStage
        new PLGameConnectionToken(socket, server),
        // TODO: gInitialTerritorySelectionTurn
        // TODO: gInitialTerritorySelectionAllowedTerritories
        // TODO: gInitialTerritorySelectionAssignment

        // TODO: gUpdateRoundState
        // TODO: gTurnAllowedActions
        // TODO: gGameError

        new PLPlayerDisconnected(socket, server),
        new PLPlayerReconnected(socket, server),
        new PLPrematureGameEnd(socket, server),
        new PLGameSaved(socket, server),
        new PLGamePaused(socket, server),
        new PLGameResumed(socket, server),
    ];
};
