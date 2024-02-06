import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useConfig } from "./use_config";
import { ServerConnection } from "../game/server/connection/server_connection";
import { useGame } from "./use_game";
import { LobbyListState, LobbyState } from "../../../protocol";
import { WarGameLobby } from "../game/lobby/war_game_lobby";
import { LobbyChatMessage } from "../game/lobby/lobby_chat";

interface IGameSessionContext {
    username: string;
    setUsername(name: string): void;

    token: string;
    setToken(token: string): void;

    /**
     * Saves the username and token of the current session to indexed db.
     */
    saveGameSession(): Promise<void>;

    connection?: ServerConnection;
    setConnection(connection?: ServerConnection): void;

    lobbies?: LobbyListState;
    currentLobby?: WarGameLobby;
    currentLobbyState?: LobbyState;
    chat: {sender: string, msg: string}[];
}

const GameSessionContext = createContext<IGameSessionContext>({} as IGameSessionContext);

const GameSessionProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {

    // Hooks
    const { sessionConfig, saveConfig } = useConfig();
    const { gameInstance } = useGame();

    // Server connection and user states
    const [username, setUsername] = useState(sessionConfig.username);
    const [token, setToken] = useState(sessionConfig.token);
    const [connection, setConnection] = useState<ServerConnection>();

    // Lobby states
    const [lobbies, setLobbies] = useState<LobbyListState | undefined>();
    const [currentLobby, setCurrentLobby] = useState<WarGameLobby | undefined>();
    const [currentLobbyState, setCurrentLobbyState] = useState<LobbyState | undefined>();
    const [chat, setChat] = useState<LobbyChatMessage[]>([]);

    /*
        Auto update this hook if anything changes about the connection.
    */
    useEffect(() => {
        if (!gameInstance) return;

        gameInstance.state.onServerConnectionChange(conn => {
            setConnection(conn?.connection);
            if (!conn) return;
            
            gameInstance.state.server?.lobbies.listen(lobbies => setLobbies(lobbies));
            gameInstance.state.server?.currentLobby.listen(lobby => {
                setCurrentLobby(lobby);
                setCurrentLobbyState(lobby?.state.value);
                lobby?.state.listen(state => setCurrentLobbyState(state));
                lobby?.chat.onUpdate(msgs => setChat([...msgs]));
            });
            gameInstance.state.server?.currentLobby.value?.state.listen(() => setCurrentLobby(gameInstance.state.server?.currentLobby.value));
        });

    }, [gameInstance]);

    /*
        Fetch the username from the config as soon as it's loaded.
    */
    useEffect(() => {
        setUsername(sessionConfig.username);
    }, [sessionConfig]);

    // TODO: Try to connect if token is valid and there's no connection

    /*
        Callback to save important values about the game session to the local storage.
    */
    const saveGameSession = useCallback(async () => {
        sessionConfig.username = username;
        sessionConfig.token = token;
        await saveConfig();
    }, [username, token, sessionConfig, saveConfig]);

    return (
        <GameSessionContext.Provider value={{ 
            username, setUsername, 
            token, setToken, 
            connection, setConnection,
            saveGameSession,
            lobbies,
            currentLobby, currentLobbyState, chat
        }}>
            { children }
        </GameSessionContext.Provider>
    );
};

function useGameSession(): IGameSessionContext {
    return useContext(GameSessionContext);
}

export { GameSessionProvider, useGameSession }