import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainMenu from '../main_menu/main_menu';
import ServerSelectScreen from '../server_select/server_select_screen';
import CfgMenu from '../config/menu/cfg_menu';
import LobbySelectScreen from '../lobby_select/lobby_select_screen';
import GameControlledRoute from './control/game_controlled_route';
import LobbyScreen from '../lobby/lobby_screen';
import GameHud from '../../game/hud/game_hud';
import CreditsScreen from '../credits/credits_screen';

const MenuRouter: React.FC = () => {
    return (
        <Routes>
            <Route path='/' Component={MainMenu} />
            <Route path='/servers' Component={ServerSelectScreen} />
            <Route path='/config' Component={CfgMenu} />
            <Route path='/credits' Component={CreditsScreen} />

            <Route
                path='/lobbies'
                element={
                    <GameControlledRoute requiresActiveSession redirectPath='/servers'>
                        <LobbySelectScreen />
                    </GameControlledRoute>
                }
            />

            <Route
                path='/lobby'
                element={
                    <GameControlledRoute requiresActiveLobby redirectPath='/lobbies'>
                        <LobbyScreen />
                    </GameControlledRoute>
                }
            />

            <Route
                path='/game'
                element={
                    <GameControlledRoute redirectPath='/lobbies'>
                        <GameHud />
                    </GameControlledRoute>
                }
            />
        </Routes>
    );
};

export default MenuRouter;
