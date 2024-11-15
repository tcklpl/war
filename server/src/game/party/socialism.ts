import { type TerritoryCode, type TurnAllowedActions, type TurnPhase } from ':protocol';
import { Party } from './party';

export class PartySocialism extends Party {
    constructor() {
        super('socialism');
    }

    get startingTerritories(): 'any' | TerritoryCode[] {
        return ['moscow'];
    }

    calculateAllowedTurnActionsForPhase(phase: TurnPhase): TurnAllowedActions {
        throw new Error('Method not implemented.');
    }

    checkWinCondition(): boolean {
        return false;
    }
}
