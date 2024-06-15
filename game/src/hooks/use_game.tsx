import React, { createContext, useContext, useMemo, useState } from 'react';
import { WarGame } from '../game/war_game';

interface IGameContext {
    gameInstance?: WarGame;
    setGameInstance(game: WarGame | undefined): void;
}

const GameContext = createContext<IGameContext>({} as IGameContext);

const GameProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [gameInstance, setGameInstance] = useState<WarGame>();

    const gameMemo = useMemo<IGameContext>(() => {
        return {
            gameInstance,
            setGameInstance,
        };
    }, [gameInstance, setGameInstance]);

    return <GameContext.Provider value={gameMemo}>{children}</GameContext.Provider>;
};

function useGame(): IGameContext {
    return useContext(GameContext);
}

export { GameProvider, useGame };
