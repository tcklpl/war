import { GameBoard } from ':game/board/board';
import { EventListener } from ':game/event/decorator/event-listener';
import type { TerritoryCode } from ':protocol';
import type { WarGameSession } from '../war-game-session';

export class InitialTerritorySelectionManager {
	constructor(private readonly session: WarGameSession) {}

	@EventListener('onTerritorySelectionTurn')
	onPlayerTurn(allowedTerritories: TerritoryCode[]) {
		console.log(allowedTerritories);

		const activeScene = game.engine.managers.scene.activeScene;
		if (!activeScene || !(activeScene instanceof GameBoard)) {
			console.warn('Territory selection package when not in a game board scene');
			return;
		}

		const allCountries = activeScene.countries.allCountries;
		const selectable = allCountries.filter(x => allowedTerritories.includes(x.territoryCode));
		const notSelectable = allCountries.filter(x => !allowedTerritories.includes(x.territoryCode));
	}
}
