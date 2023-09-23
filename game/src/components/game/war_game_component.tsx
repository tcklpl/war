import React from "react"
import WarCanvas from "../canvas";
import { GameProvider } from "../../hooks/use_game";
import LoadingScreen from "../loading/loading_screen";
import FailedToStartEngineScreen from "../error/failed_to_start_engine/failed_to_start_engine_screen";
import { CrashProvider } from "../../hooks/use_crash";
import HUDPerformance from "./hud/debug/hud_performance";
import HUDAlert from "./hud/alert/hud_alert";
import { AlertProvider } from "../../hooks/use_alert";
import PauseScreen from "./hud/pause_screen/pause_screen";
import { ConfigProvider } from "../../hooks/use_config";

const Hooks: React.FC<{children?: React.ReactNode}> = ({ children }) => {
    return (
        <GameProvider>
            <ConfigProvider>
                <CrashProvider>
                    <AlertProvider>
                        { children }
                    </AlertProvider>
                </CrashProvider>
            </ConfigProvider>
        </GameProvider>
    )
}

const WarGameComponent: React.FC = () => {

    return (
        <>
            <Hooks>
                <FailedToStartEngineScreen/>
                <LoadingScreen/>
                <PauseScreen/>
                <HUDAlert/>
                <HUDPerformance/>
                <WarCanvas/>
            </Hooks>
        </>
    );
}

export default WarGameComponent;