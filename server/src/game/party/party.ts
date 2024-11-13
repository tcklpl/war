import * as crypto from 'crypto';
import {
    type GameParty,
    type TerritoryCode,
    type TurnAllowedActionMoveTroops,
    type TurnAllowedActions,
    type TurnPhase,
} from '../../../../protocol';
import { LobbyPlayer } from '../player/lobby_player';
import { Territory } from '../territory/territory';

export abstract class Party {
    player?: LobbyPlayer;
    private _territories: Territory[] = [];
    availableTroops = 0;
    readonly turnPhaseSequence: TurnPhase[] = ['troop positioning', 'attack', 'over'];

    constructor(readonly protocolValue: GameParty) {}

    abstract get startingTerritories(): 'any' | TerritoryCode[];

    addTerritory(t: Territory) {
        if (!this._territories.some(x => x === t)) {
            this._territories.push(t);
            t.setParty(this);
        }
    }

    removeTerritory(t: Territory) {
        if (this._territories.some(x => x === t)) {
            this._territories = this._territories.filter(x => x !== t);
            t.setParty(undefined);
        }
    }

    protected generateActionID() {
        return crypto.randomUUID();
    }

    onRoundStart() {}
    onTurnStart() {}
    abstract calculateAllowedTurnActionsForPhase(phase: TurnPhase): TurnAllowedActions;
    onTurnEnd() {}
    onRoundEnd() {}

    protected calculatePossibleTroopMovement(): TurnAllowedActionMoveTroops {
        return {
            id: this.generateActionID(),
            action_forces_phase_change: false,
            movement: this._territories.flatMap(t =>
                t.node.adjacentNodes.map(a => {
                    return {
                        from: t.code,
                        to: a.data.code,
                        count: t.troops.length,
                    };
                }),
            ),
        };
    }

    abstract checkWinCondition(): boolean;

    get territories() {
        return this._territories;
    }

    get numberOfTroopsPerTurn() {
        return Math.max(Math.floor(this._territories.length / 2), 1);
    }

    get targetableTerritories() {
        return this._territories
            .flatMap(t => t.node.adjacentNodes)
            .filter(t => t.data.party !== this)
            .map(t => t.data);
    }
}
