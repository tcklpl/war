import React, { createContext, useContext, useState } from "react";
import { WarGame } from "../game/war_game";

interface IGameContext {
    gameInstance?: WarGame;
    setGameInstance(game: WarGame | undefined): void;
}

const GameContext = createContext<IGameContext>({} as IGameContext);

const GameProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {

    const [gameInstance, setGameInstance] = useState<WarGame>();

    return (
        <GameContext.Provider value={{ gameInstance, setGameInstance }}>
            { children }
        </GameContext.Provider>
    );
};

function useGame(): IGameContext {
    return useContext(GameContext);
}

export { GameProvider, useGame }