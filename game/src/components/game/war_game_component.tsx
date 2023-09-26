import React from "react"
import WarCanvas from "../canvas";
import LoadingScreen from "../loading/loading_screen";
import FailedToStartEngineScreen from "../error/failed_to_start_engine/failed_to_start_engine_screen";
import HUDPerformance from "./hud/debug/hud_performance";
import HUDAlert from "./hud/alert/hud_alert";
import PauseScreen from "./hud/pause_screen/pause_screen";


const WarGameComponent: React.FC = () => {

    return (
        <>
            <FailedToStartEngineScreen/>
            <LoadingScreen/>
            <PauseScreen/>
            <HUDAlert/>
            <HUDPerformance/>
            <WarCanvas/>
        </>
    );
}

export default WarGameComponent;