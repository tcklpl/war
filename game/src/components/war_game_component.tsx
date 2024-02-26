import React from "react"
import WarCanvas from "./canvas";
import LoadingScreen from "./loading/loading_screen";
import FailedToStartEngineScreen from "./error/failed_to_start_engine/failed_to_start_engine_screen";
import HUDPerformance from "./game/hud/debug/hud_performance";
import PauseScreen from "./game/hud/pause_screen/pause_screen";
import MenuRouter from "./menu/router/menu_router";
import HUDAlert from "./alert/hud_alert";
import HUDConfirmation from "./confirmation/hud_confirmation";


const WarGameComponent: React.FC = () => {

    return (
        <>
            <FailedToStartEngineScreen/>
            <LoadingScreen/>
            <MenuRouter/>
            <PauseScreen/>
            <HUDAlert/>
            <HUDConfirmation/>
            <HUDPerformance/>
            <WarCanvas/>
        </>
    );
}

export default WarGameComponent;