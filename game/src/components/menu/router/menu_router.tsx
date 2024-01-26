import React from "react";
import { Route, Routes } from 'react-router-dom';
import MainMenu from "../main_menu/main_menu";
import ServerSelectScreen from "../server_select/server_select_screen";
import CfgMenu from "../config/cfg_menu";
import ServerRoomSelectScreen from "../server_room_select/server_room_select_screen";
import GameControlledRoute from "./control/game_controlled_route";

const MenuRouter: React.FC = () => {


    return (
        <Routes>
            <Route path="/" Component={MainMenu}/>
            <Route path="/servers" Component={ServerSelectScreen}/>
            <Route path="/config" Component={CfgMenu}/>
            
            <Route path="/rooms" element={
                <GameControlledRoute requiresActiveSession redirectPath="/servers">
                    <ServerRoomSelectScreen/>
                </GameControlledRoute>
            }/>
        </Routes>
    );
};

export default MenuRouter;