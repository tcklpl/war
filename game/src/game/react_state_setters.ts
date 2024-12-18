import { GamePauseReason, LobbyListState, LobbyState } from ':protocol';
import React from 'react';
import { LobbyChatMessage } from './lobby/lobby_chat';
import { WarGameLobby } from './lobby/war_game_lobby';
import { WarGameSession } from './lobby/war_game_session';
import { ReconnectionInfo } from './server/connection/reconnection_info';
import { ServerConnection } from './server/connection/server_connection';
import { LobbyExitReason } from './server/war_server';
import { WarGame } from './war_game';

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

    updateForLobbyExit!: (reason: LobbyExitReason | undefined) => void;
}
