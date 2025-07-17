import type { GameSocket } from '../../../../../@types/socket';
import type { WarServer } from '../../../war-server';
import { PLGameConnectionToken } from './game/pl-game-connection-token';
import { PLGamePaused } from './game/pl-game-paused';
import { PLGameResumed } from './game/pl-game-resumed';
import { PLGameSaved } from './game/pl-game-saved';
import { PLInitialGameState } from './game/pl-initial-game-state';
import { PLPlayerDisconnected } from './game/pl-player-disconnected';
import { PLPlayerReconnected } from './game/pl-player-reconnected';
import { PLPrematureGameEnd } from './game/pl-premature-game-end';
import { PLGameInitialTerritorySelectionAllowedTerritories } from './game/territory-selection/pl-select-allowed-territories';
import { PLGameInitialTerritorySelectionAssignment } from './game/territory-selection/pl-select-assignment';
import { PLGameInitialTerritorySelectionTurn } from './game/territory-selection/pl-select-turn';
import { PLChat } from './lobby/pl-chat';
import { PLGameStartCancelled } from './lobby/pl-game-start-cancelled';
import { PLJoinedLobby } from './lobby/pl-joined-lobby';
import { PLLeftLobby } from './lobby/pl-left-lobby';
import { PLStartingGame } from './lobby/pl-starting-game';
import { PLUpdateLobbyState } from './lobby/pl-update-lobby-state';
import { PLLobbies } from './lobby-list/pl-lobbies';

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
		new PLGameInitialTerritorySelectionTurn(socket, server),
		new PLGameInitialTerritorySelectionAllowedTerritories(socket, server),
		new PLGameInitialTerritorySelectionAssignment(socket, server),

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
