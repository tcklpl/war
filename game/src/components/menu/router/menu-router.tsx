import type React from 'react';
import { Route, Routes } from 'react-router-dom';
import GameHud from '../../game/hud/game-hud';
import CfgMenu from '../config/menu/cfg-menu';
import CreditsScreen from '../credits/credits-screen';
import LobbyScreen from '../lobby/lobby-screen';
import LobbySelectScreen from '../lobby-select/lobby-select-screen';
import MainMenu from '../main-menu/main-menu';
import ServerSelectScreen from '../server-select/server-select-screen';
import GameControlledRoute from './control/game-controlled-route';

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
					<GameControlledRoute requiresActiveGameSession redirectPath='/lobbies'>
						<GameHud />
					</GameControlledRoute>
				}
			/>
		</Routes>
	);
};

export default MenuRouter;
