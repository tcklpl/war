import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ConfigDisplay } from "../engine/config/cfg_display";
import { ConfigGraphics } from "../engine/config/cfg_graphics";
import { useGame } from "./use_game";
import { LoadStage } from "../game/loader/load_stage";
import { ConfigGame } from "../engine/config/cfg_game";
import { WarGame } from "../game/war_game";

interface IConfigContext {
    displayConfig: ConfigDisplay;
    setDisplayConfig(display: ConfigDisplay): void;

    graphicsConfig: ConfigGraphics;
    setGraphicsConfig(graphics: ConfigGraphics): void;

    gameConfig: ConfigGame;
    setGameConfig(game: ConfigGame): void;

    saveConfig(): void;
}

const ConfigContext = createContext<IConfigContext>({} as IConfigContext);

const ConfigProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {

    const [displayConfig, setDisplayConfig] = useState<ConfigDisplay>(new ConfigDisplay());
    const [graphicsConfig, setGraphicsConfig] = useState<ConfigGraphics>(new ConfigGraphics());
    const [gameConfig, setGameConfig] = useState<ConfigGame>(new ConfigGame());

    const { gameInstance, setGameInstance } = useGame();

    useEffect(() => {
        if (!gameInstance) return;
        
        // load the configs when the initialization is over
        gameInstance.loader.onLoadStageChange(ls => {
            if (ls === LoadStage.COMPLETE) {
                setDisplayConfig({...gameInstance.engine.config.display});
                setGraphicsConfig({...gameInstance.engine.config.graphics});
                setGameConfig({...gameInstance.engine.config.game});
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

    const configHasChanged = useCallback(() => {
        if (!gameInstance) return false;

        let hasChanged = false;
        hasChanged = hasChanged || !compareObjects(gameInstance.engine.config.display, displayConfig);
        hasChanged = hasChanged || !compareObjects(gameInstance.engine.config.graphics, graphicsConfig);
        hasChanged = hasChanged || !compareObjects(gameInstance.engine.config.game, gameConfig);

        return hasChanged;

    }, [displayConfig, graphicsConfig, gameConfig, gameInstance]);

    const saveConfig = useCallback(() => {
        if (!gameInstance) return;

        // see if the user has actually changed anything
        const shouldReinitializeRenderer = configHasChanged();

        // update engine config copying the local config objects
        gameInstance.engine.config.display = {...displayConfig};
        gameInstance.engine.config.graphics = {...graphicsConfig};
        gameInstance.engine.config.game = {...gameConfig};
        gameInstance.engine.config.saveConfig();

        // only reinitialize the game if needed
        const reinitializeGame = async () => {
            gameInstance.kill();
            const game = WarGame.initialize();
            setGameInstance(game);
        }
        if (shouldReinitializeRenderer) {
            reinitializeGame();
        }

    }, [displayConfig, graphicsConfig, gameConfig, gameInstance, setGameInstance, configHasChanged]);

    return (
        <ConfigContext.Provider value={{ displayConfig, setDisplayConfig, graphicsConfig, setGraphicsConfig, gameConfig, setGameConfig, saveConfig }}>
            { children }
        </ConfigContext.Provider>
    );
};

function useConfig(): IConfigContext {
    return useContext(ConfigContext);
}

export { ConfigProvider, useConfig }