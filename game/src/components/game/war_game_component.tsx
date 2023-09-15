import React from "react"
import WarCanvas from "../canvas";
import { GameProvider } from "../../hooks/use_game";
import LoadingScreen from "../loading/loading_screen";
import FailedToStartEngineScreen from "../error/failed_to_start_engine/failed_to_start_engine_screen";
import { CrashProvider } from "../../hooks/use_crash";
import HUDPerformance from "./hud/debug/hud_performance";

const Hooks: React.FC<{children?: React.ReactNode}> = ({ children }) => {
    return (
        <GameProvider>
            <CrashProvider>
                { children }
            </CrashProvider>
        </GameProvider>
    )
}

const WarGameComponent: React.FC = () => {

    return (
        <>
            <Hooks>
                <FailedToStartEngineScreen/>
                <LoadingScreen/>
                <HUDPerformance/>
                <WarCanvas/>
            </Hooks>
        </>
    );
}

export default WarGameComponent;