import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useConfig } from "./use_config";

interface IGameSessionContext {
    username: string;
    setUsername: (name: string) => void;

    saveGameSession(): Promise<void>;
}

const GameSessionContext = createContext<IGameSessionContext>({} as IGameSessionContext);

const GameSessionProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {

    const { sessionConfig, saveConfig } = useConfig();
    const [username, setUsername] = useState(sessionConfig.username);

    useEffect(() => {
        setUsername(sessionConfig.username);
    }, [sessionConfig]);

    const saveGameSession = useCallback(async () => {
        sessionConfig.username = username;
        await saveConfig();
    }, [username, sessionConfig, saveConfig]);

    return (
        <GameSessionContext.Provider value={{ username, setUsername, saveGameSession }}>
            { children }
        </GameSessionContext.Provider>
    );
};

function useGameSession(): IGameSessionContext {
    return useContext(GameSessionContext);
}

export { GameSessionProvider, useGameSession }