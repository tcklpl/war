import { type TerritoryCode, type TurnAllowedActions, type TurnPhase } from ':protocol';
import { Party } from './party';

export class PartyCapitalism extends Party {
    constructor() {
        super('capitalism');
    }

    get startingTerritories(): 'any' | TerritoryCode[] {
        return ['california'];
    }

    calculateAllowedTurnActionsForPhase(phase: TurnPhase): TurnAllowedActions {
        throw new Error('Method not implemented.');
    }

    checkWinCondition(): boolean {
        return false;
    }
}
