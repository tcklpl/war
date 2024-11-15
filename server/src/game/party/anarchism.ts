import {
    type TerritoryCode,
    type TurnAllowedAction,
    type TurnAllowedActionAttack,
    type TurnAllowedActionPlaceTroops,
    type TurnAllowedActions,
    type TurnPhase,
} from ':protocol';
import { Party } from './party';

export class PartyAnarchism extends Party {
    readonly turnPhaseSequence: TurnPhase[] = ['attack', 'troop positioning', 'over'];

    constructor() {
        super('anarchism');
    }

    get startingTerritories(): TerritoryCode[] | 'any' {
        return 'any';
    }

    calculateAllowedTurnActionsForPhase(phase: TurnPhase) {
        const allowed_actions: TurnAllowedAction[] = [];

        switch (phase) {
            case 'attack':
                allowed_actions.push(<TurnAllowedActionAttack>{
                    id: this.generateActionID(),
                    action_forces_phase_change: false,
                    targetable_territories: this.targetableTerritories.map(t => t.code),
                });
                break;
            case 'troop positioning':
                allowed_actions.push(<TurnAllowedActionPlaceTroops>{
                    id: this.generateActionID(),
                    action_forces_phase_change: false,
                    troops_to_position: 1,
                    allowed_territories: this.territories.map(t => t.code),
                });
                allowed_actions.push(this.calculatePossibleTroopMovement());
                break;
            case 'over':
                break;
        }

        return <TurnAllowedActions>{
            phase,
            allowed_actions,
        };
    }

    checkWinCondition(): boolean {
        return false;
    }

    get numberOfTroopsPerTurn() {
        return 0;
    }
}
