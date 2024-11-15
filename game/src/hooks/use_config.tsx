import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ConfigDisplay } from '../engine/config/cfg_display';
import { ConfigGame } from '../engine/config/cfg_game';
import { ConfigGraphics } from '../engine/config/cfg_graphics';
import { ConfigSession } from '../engine/config/cfg_session';
import { LoadStage } from '../game/loader/load_stage';
import { useGame } from './use_game';

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

const ConfigProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [displayConfig, setDisplayConfig] = useState(new ConfigDisplay());
    const [graphicsConfig, setGraphicsConfig] = useState(new ConfigGraphics());
    const [gameConfig, setGameConfig] = useState(new ConfigGame());
    const [sessionConfig, setSessionConfig] = useState(new ConfigSession());

    const { gameInstance } = useGame();

    useEffect(() => {
        if (!gameInstance) return;

        // load the configs when the initialization is over
        gameInstance.loader.onLoadStageChange(ls => {
            if (ls === LoadStage.COMPLETE) {
                setDisplayConfig({ ...gameInstance.engine.config.display });
                setGraphicsConfig({ ...gameInstance.engine.config.graphics });
                setGameConfig({ ...gameInstance.engine.config.game });
                setSessionConfig({ ...gameInstance.engine.config.session });
            }
        });
    }, [gameInstance]);

    const compareObjects = (a: any, b: any) => {
        const keysA = Object.keys(a);
        const keysB = Object.keys(a);
        if (keysA.length !== keysB.length) return false;

        for (const k of keysA) {
            if (a[k] !== b[k]) return false;
        }

        return true;
    };

    const shouldRenitializeRenderer = useCallback(() => {
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
        const shouldReinitializeRenderer = shouldRenitializeRenderer();

        // update engine config copying the local config objects
        gameInstance.engine.config.display = { ...displayConfig };
        gameInstance.engine.config.graphics = { ...graphicsConfig };
        gameInstance.engine.config.game = { ...gameConfig };
        gameInstance.engine.config.session = { ...sessionConfig };
        await gameInstance.engine.config.saveConfig();

        // only reinitialize the game if needed
        if (shouldReinitializeRenderer) {
            gameInstance.engine.reinitializeRenderer();
        }
    }, [displayConfig, graphicsConfig, gameConfig, gameInstance, sessionConfig, shouldRenitializeRenderer]);

    const valueMemo = useMemo<IConfigContext>(() => {
        return {
            displayConfig,
            setDisplayConfig,
            graphicsConfig,
            setGraphicsConfig,
            gameConfig,
            setGameConfig,
            sessionConfig,
            setSessionConfig,
            saveConfig,
        } as IConfigContext;
    }, [
        displayConfig,
        setDisplayConfig,
        graphicsConfig,
        setGraphicsConfig,
        gameConfig,
        setGameConfig,
        sessionConfig,
        setSessionConfig,
        saveConfig,
    ]);

    return <ConfigContext.Provider value={valueMemo}>{children}</ConfigContext.Provider>;
};

function useConfig(): IConfigContext {
    return useContext(ConfigContext);
}

export { ConfigProvider, useConfig };
