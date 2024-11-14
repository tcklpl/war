import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GamePauseReason, LobbyListState, LobbyState } from '../../../protocol';
import { LobbyChatMessage } from '../game/lobby/lobby_chat';
import { WarGameLobby } from '../game/lobby/war_game_lobby';
import { WarGameSession } from '../game/lobby/war_game_session';
import { ReconnectionInfo } from '../game/server/connection/reconnection_info';
import { ServerConnection } from '../game/server/connection/server_connection';
import { LobbyExitReason } from '../game/server/war_server';
import { useAlert } from './use_alert';
import { useConfig } from './use_config';
import { useGame } from './use_game';

interface IGameSessionContext {
    // Server states
    username: string;
    setUsername(name: string): void;
    reconnectionInfo?: ReconnectionInfo;
    setReconnectionInfo(ri?: ReconnectionInfo): void;

    /**
     * Saves the username and token of the current session to indexed db.
     */
    saveGameSession(): Promise<void>;

    connection?: ServerConnection;
    setConnection(connection?: ServerConnection): void;
    lobbies?: LobbyListState;

    // Lobby states
    currentLobby?: WarGameLobby;
    currentLobbyState?: LobbyState;
    cloneLobbyState(): LobbyState | undefined;
    modifyLobbyState(mod: (state: LobbyState) => LobbyState): void;
    gameStartingIn?: number;
    chat: { sender: string; msg: string }[];

    // Game states
    currentGameSession?: WarGameSession;
    gTurnPlayerIndex: number;
    gPauseReason?: GamePauseReason;
    gIsPaused: boolean;
}

const GameSessionContext = createContext<IGameSessionContext>({} as IGameSessionContext);

const GameSessionProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    // Hooks
    const { sessionConfig, saveConfig } = useConfig();
    const { gameInstance } = useGame();
    const { enqueueAlert } = useAlert();
    const { t } = useTranslation(['lobby', 'ingame']);

    // Server connection and user states
    const [username, setUsername] = useState(sessionConfig.username);
    const [reconnectionInfo, setReconnectionInfo] = useState(sessionConfig.reconnectionInfo);
    const [connection, setConnection] = useState<ServerConnection>();

    // Lobby states
    const [lobbies, setLobbies] = useState<LobbyListState | undefined>();
    const [currentLobby, setCurrentLobby] = useState<WarGameLobby | undefined>();
    const [currentLobbyState, setCurrentLobbyState] = useState<LobbyState | undefined>();
    const [chat, setChat] = useState<LobbyChatMessage[]>([]);
    const [gameStartingIn, setGameStartingIn] = useState<number | undefined>();

    // game states
    const [currentGameSession, setCurrentGameSession] = useState<WarGameSession | undefined>();
    const [gTurnPlayerIndex, setGTurnPlayerIndex] = useState(0);
    const [gPauseReason, setGPauseReason] = useState<GamePauseReason | undefined>();
    const gIsPaused = !!gPauseReason;

    const updateForLobbyExit = useCallback(
        (reason?: LobbyExitReason) => {
            if (!gameInstance) return;
            if (!gameInstance.state.server) return;
            switch (reason) {
                case '':
                    return;
                case 'left':
                    break;
                case 'kicked':
                    enqueueAlert({
                        content: t('lobby:kicked'),
                    });
                    break;
                case 'room closed':
                    enqueueAlert({
                        title: t('ingame:room_closed'),
                        content: t('ingame:room_closed_desc'),
                    });
                    break;
            }
            gameInstance.state.server.lastLobbyExitReason = '';
        },
        [gameInstance, enqueueAlert, t],
    );

    const modifyLobbyState = useCallback(
        (mod: (state: LobbyState) => LobbyState) => {
            if (!currentLobbyState) return;
            const newState = mod(structuredClone(currentLobbyState));
            if (JSON.stringify(currentLobbyState) === JSON.stringify(newState)) return;
            currentLobby?.modifyLobbyState(newState);
        },
        [currentLobby, currentLobbyState],
    );

    const cloneLobbyState = useCallback(() => {
        return currentLobbyState ? structuredClone(currentLobbyState) : undefined;
    }, [currentLobbyState]);

    /*
        Fetch the username from the config as soon as it's loaded.
    */
    useEffect(() => {
        setUsername(sessionConfig.username);
        setReconnectionInfo(sessionConfig.reconnectionInfo);
    }, [sessionConfig]);

    /*
        Callback to save important values about the game session to the local storage.
    */
    const saveGameSession = useCallback(async () => {
        sessionConfig.username = username;
        sessionConfig.reconnectionInfo = reconnectionInfo;
        await saveConfig();
    }, [username, sessionConfig, reconnectionInfo, saveConfig]);

    useEffect(() => {
        saveGameSession();
    }, [saveGameSession]);

    /**
     * Pass react state setters to the non-component classes (plain ts files).
     * I decided to do this as it's simpler than importing a whole ass state management library.
     */
    useEffect(() => {
        if (!gameInstance) return;
        const s = gameInstance.state.reactState.useGameSession;
        s.setUsername = setUsername;
        s.setConnection = setConnection;
        s.setReconnectionInfo = setReconnectionInfo;

        s.setLobbies = setLobbies;
        s.setCurrentLobby = setCurrentLobby;
        s.setCurrentLobbyState = setCurrentLobbyState;
        s.setChat = setChat;
        s.setGameStartingIn = setGameStartingIn;

        s.setCurrentGameSession = setCurrentGameSession;
        s.setGTurnPlayerIndex = setGTurnPlayerIndex;
        s.setGPauseReason = setGPauseReason;

        s.updateForLobbyExit = updateForLobbyExit;
    }, [
        gameInstance,
        setUsername,
        setReconnectionInfo,
        connection,
        setConnection,
        setLobbies,
        currentLobby,
        setCurrentLobby,
        setCurrentLobbyState,
        setChat,
        setGameStartingIn,
        setCurrentGameSession,
        setGTurnPlayerIndex,
        setGPauseReason,
        updateForLobbyExit,
    ]);

    const gameSessionMemo = useMemo<IGameSessionContext>(() => {
        return {
            username,
            setUsername,
            reconnectionInfo,
            setReconnectionInfo,
            connection,
            setConnection,
            saveGameSession,
            lobbies,
            currentLobby,
            currentLobbyState,
            modifyLobbyState,
            cloneLobbyState,
            chat,
            gameStartingIn,
            currentGameSession,
            gTurnPlayerIndex,
            gPauseReason,
            gIsPaused,
        };
    }, [
        username,
        setUsername,
        reconnectionInfo,
        setReconnectionInfo,
        connection,
        setConnection,
        saveGameSession,
        lobbies,
        currentLobby,
        currentLobbyState,
        modifyLobbyState,
        cloneLobbyState,
        chat,
        gameStartingIn,
        currentGameSession,
        gTurnPlayerIndex,
        gPauseReason,
        gIsPaused,
    ]);

    return <GameSessionContext.Provider value={gameSessionMemo}>{children}</GameSessionContext.Provider>;
};

function useGameSession(): IGameSessionContext {
    return useContext(GameSessionContext);
}

export { GameSessionProvider, useGameSession };
