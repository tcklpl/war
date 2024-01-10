import React from "react";
import { Route, Routes } from 'react-router-dom';
import MainMenu from "../main_menu/main_menu";
import ServerSelectScreen from "../server_select/server_select_screen";
import CfgMenu from "../config/cfg_menu";

const MenuRouter: React.FC = () => {


    return (
        <Routes>
            <Route path="/" Component={MainMenu}/>
            <Route path="/servers" Component={ServerSelectScreen}/>
            <Route path="/config" Component={CfgMenu}/>
        </Routes>
    );
};

export default MenuRouter;