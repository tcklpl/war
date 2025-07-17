import type { TerritoryCode, TurnAllowedActions, TurnPhase } from ':protocol';
import { Party } from './party';

export class PartyNotSet extends Party {
	get startingTerritories(): TerritoryCode[] | 'any' {
		throw new Error('Method not implemented.');
	}
	calculateAllowedTurnActionsForPhase(_phase: TurnPhase): TurnAllowedActions {
		throw new Error('Method not implemented.');
	}
	checkWinCondition(): boolean {
		throw new Error('Method not implemented.');
	}

	constructor() {
		super('not_set');
	}
}
