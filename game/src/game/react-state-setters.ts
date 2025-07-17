import type { GamePauseReason, LobbyListState, LobbyState } from ':protocol';
import type React from 'react';
import type { LobbyChatMessage } from './lobby/lobby-chat';
import type { WarGameLobby } from './lobby/war-game-lobby';
import type { WarGameSession } from './lobby/war-game-session';
import type { ReconnectionInfo } from './server/connection/reconnection-info';
import type { ServerConnection } from './server/connection/server-connection';
import type { LobbyExitReason } from './server/war-server';
import type { WarGame } from './war-game';

type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>;
type UndefinedDispatcher<T> = React.Dispatch<React.SetStateAction<T | undefined>>;

export class ReactStateSetters {
	readonly useGame = new ReactStateUseGame();
	readonly useGameSession = new ReactStateUseGameSession();
}

class ReactStateUseGame {
	setGameInstance!: (game: WarGame | undefined) => void;
}

class ReactStateUseGameSession {
	setUsername!: Dispatcher<string>;
	setReconnectionInfo!: UndefinedDispatcher<ReconnectionInfo>;
	setConnection!: UndefinedDispatcher<ServerConnection>;

	// Lobby states
	setLobbies!: UndefinedDispatcher<LobbyListState>;
	setCurrentLobby!: UndefinedDispatcher<WarGameLobby>;
	setCurrentLobbyState!: UndefinedDispatcher<LobbyState>;
	setChat!: Dispatcher<LobbyChatMessage[]>;
	setGameStartingIn!: UndefinedDispatcher<number>;

	// Game states
	setCurrentGameSession!: UndefinedDispatcher<WarGameSession>;
	setGTurnPlayerIndex!: Dispatcher<number>;
	setGPauseReason!: UndefinedDispatcher<GamePauseReason>;

	setGHoverI18nKey!: UndefinedDispatcher<string>;

	updateForLobbyExit!: (reason: LobbyExitReason | undefined) => void;
}
