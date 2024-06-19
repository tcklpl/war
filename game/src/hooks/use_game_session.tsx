import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useConfig } from './use_config';
import { ServerConnection } from '../game/server/connection/server_connection';
import { useGame } from './use_game';
import { LobbyListState, LobbyState } from '../../../protocol';
import { WarGameLobby } from '../game/lobby/war_game_lobby';
import { LobbyChatMessage } from '../game/lobby/lobby_chat';
import { useAlert } from './use_alert';
import { useTranslation } from 'react-i18next';
import { WarGameSession } from '../game/lobby/war_game_session';
import { ReconnectionInfo } from '../game/server/connection/reconnection_info';

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
}

const GameSessionContext = createContext<IGameSessionContext>({} as IGameSessionContext);

const GameSessionProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    // Hooks
    const { sessionConfig, saveConfig } = useConfig();
    const { gameInstance } = useGame();
    const { enqueueAlert } = useAlert();
    const { t } = useTranslation(['lobby']);

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

    const updateForLobbyExit = useCallback(
        (reason: '' | 'kicked' | 'left' | undefined) => {
            if (!gameInstance) return;
            if (!gameInstance.state.server) return;
            if (reason === '') return;
            if (reason === 'kicked') {
                enqueueAlert({
                    content: t('lobby:kicked'),
                });
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
    ]);

    return <GameSessionContext.Provider value={gameSessionMemo}>{children}</GameSessionContext.Provider>;
};

function useGameSession(): IGameSessionContext {
    return useContext(GameSessionContext);
}

export { GameSessionProvider, useGameSession };
