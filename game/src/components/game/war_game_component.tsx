import React from "react"
import WarCanvas from "../canvas";
import { GameProvider } from "../../hooks/use_game";
import LoadingScreen from "../loading/loading_screen";

const WarGameComponent: React.FC = () => {

    return (
        <>
            <GameProvider>
                <LoadingScreen/>
                <WarCanvas/>
            </GameProvider>
        </>
    );
}

export default WarGameComponent;