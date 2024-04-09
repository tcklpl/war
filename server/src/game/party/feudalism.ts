import { TerritoryCode, TurnAllowedActions, TurnPhase } from "../../../../protocol";
import { Party } from "./party";

export class PartyFeudalism extends Party {

    constructor() {
        super("feudalism");
    }

    get startingTerritories(): "any" | TerritoryCode[] {
        return [ "france" ];
    }

    calculateAllowedTurnActionsForPhase(phase: TurnPhase): TurnAllowedActions {
        throw new Error("Method not implemented.");
    }

    checkWinCondition(): boolean {
        return false;
    }
    
}