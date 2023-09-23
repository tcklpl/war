import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ConfigDisplay } from "../engine/config/cfg_display";
import { ConfigGraphics } from "../engine/config/cfg_graphics";
import { useGame } from "./use_game";
import { LoadStage } from "../game/loader/load_stage";
import { ConfigGame } from "../engine/config/cfg_game";

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

    const { gameInstance } = useGame();

    useEffect(() => {
        if (!gameInstance) return;
        
        // load the configs when the initialization is over
        gameInstance.loader.onLoadStageChange(ls => {
            if (ls === LoadStage.COMPLETE) {
                setDisplayConfig(gameInstance.engine.config.display);
                setGraphicsConfig(gameInstance.engine.config.graphics);
                setGameConfig(gameInstance.engine.config.game);
            }
        });

    }, [gameInstance]);

    const saveConfig = useCallback(() => {
        if (!gameInstance) return;

        gameInstance.engine.config.display = displayConfig;
        gameInstance.engine.config.graphics = graphicsConfig;
        gameInstance.engine.config.game = gameConfig;
        gameInstance.engine.config.saveConfig();
    }, [displayConfig, graphicsConfig, gameConfig, gameInstance]);

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