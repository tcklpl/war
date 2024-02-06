import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ConfigDisplay } from "../engine/config/cfg_display";
import { ConfigGraphics } from "../engine/config/cfg_graphics";
import { useGame } from "./use_game";
import { LoadStage } from "../game/loader/load_stage";
import { ConfigGame } from "../engine/config/cfg_game";
import { WarGame } from "../game/war_game";
import { ConfigSession } from "../engine/config/cfg_session";

interface IConfigContext {
    displayConfig: ConfigDisplay;
    setDisplayConfig(display: ConfigDisplay): void;

    graphicsConfig: ConfigGraphics;
    setGraphicsConfig(graphics: ConfigGraphics): void;

    gameConfig: ConfigGame;
    setGameConfig(game: ConfigGame): void;

    sessionConfig: ConfigSession;
    setSessionConfig(session: ConfigSession): void;

    saveConfig(): Promise<void>;
}

const ConfigContext = createContext<IConfigContext>({} as IConfigContext);

const ConfigProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {

    const [displayConfig, setDisplayConfig] = useState(new ConfigDisplay());
    const [graphicsConfig, setGraphicsConfig] = useState(new ConfigGraphics());
    const [gameConfig, setGameConfig] = useState(new ConfigGame());
    const [sessionConfig, setSessionConfig] = useState(new ConfigSession());

    const { gameInstance, setGameInstance } = useGame();

    useEffect(() => {
        if (!gameInstance) return;
        
        // load the configs when the initialization is over
        gameInstance.loader.onLoadStageChange(ls => {
            if (ls === LoadStage.COMPLETE) {
                setDisplayConfig({...gameInstance.engine.config.display});
                setGraphicsConfig({...gameInstance.engine.config.graphics});
                setGameConfig({...gameInstance.engine.config.game});
                setSessionConfig({...gameInstance.engine.config.session});
            }
        });

    }, [gameInstance]);

    const compareObjects = (a: any, b: any) => {
        const keysA = Object.keys(a);
        const keysB = Object.keys(a);
        if (keysA.length !== keysB.length) return false;
        
        for (let k of keysA) {
            if (a[k] !== b[k]) return false;
        }

        return true;
    }

    const shouldRenitializeGame = useCallback(() => {
        if (!gameInstance) return false;

        let hasChanged = false;
        // display config changes should not reinitialize the whole game, only graphical or game
        hasChanged = hasChanged || !compareObjects(gameInstance.engine.config.graphics, graphicsConfig);
        hasChanged = hasChanged || !compareObjects(gameInstance.engine.config.game, gameConfig);

        return hasChanged;

    }, [graphicsConfig, gameConfig, gameInstance]);

    const saveConfig = useCallback(async () => {
        if (!gameInstance) return;

        // see if the user has actually changed anything
        const shouldReinitializeGame = shouldRenitializeGame();

        // update engine config copying the local config objects
        gameInstance.engine.config.display = {...displayConfig};
        gameInstance.engine.config.graphics = {...graphicsConfig};
        gameInstance.engine.config.game = {...gameConfig};
        gameInstance.engine.config.session = {...sessionConfig};
        await gameInstance.engine.config.saveConfig();

        // only reinitialize the game if needed
        const reinitializeGame = async () => {
            await gameInstance.kill();
            const game = WarGame.initialize();
            setGameInstance(game);
        }
        if (shouldReinitializeGame) {
            reinitializeGame();
        }

    }, [displayConfig, graphicsConfig, gameConfig, gameInstance, sessionConfig, setGameInstance, shouldRenitializeGame]);

    return (
        <ConfigContext.Provider value={{ 
            displayConfig, setDisplayConfig, 
            graphicsConfig, setGraphicsConfig, 
            gameConfig, setGameConfig, 
            sessionConfig, setSessionConfig, 
            saveConfig 
        }}>
            { children }
        </ConfigContext.Provider>
    );
};

function useConfig(): IConfigContext {
    return useContext(ConfigContext);
}

export { ConfigProvider, useConfig }