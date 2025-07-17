import type { WarGame } from ':game/war-game';
import type React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface IGameContext {
	gameInstance?: WarGame;
	setGameInstance(game: WarGame | undefined): void;
}

const GameContext = createContext<IGameContext>({} as IGameContext);

const GameProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const [gameInstance, setGameInstance] = useState<WarGame>();

	useEffect(() => {
		if (!gameInstance) return;
		gameInstance.state.reactState.useGame.setGameInstance = setGameInstance;
	}, [gameInstance]);

	const gameMemo = useMemo<IGameContext>(() => {
		return {
			gameInstance,
			setGameInstance,
		};
	}, [gameInstance]);

	return <GameContext.Provider value={gameMemo}>{children}</GameContext.Provider>;
};

function useGame(): IGameContext {
	return useContext(GameContext);
}

export { GameProvider, useGame };
