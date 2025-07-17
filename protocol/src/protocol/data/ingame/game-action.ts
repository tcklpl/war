import type { TerritoryCode } from '../territory';

export type TurnPhase = 'troop positioning' | 'attack' | 'over';

/*
    SERVER-SIDE
*/

export type TurnAllowedAction = TurnAllowedActionPlaceTroops | TurnAllowedActionAttack | TurnAllowedActionMoveTroops;

export type TurnAllowedActions = {
	phase: TurnPhase;
	allowed_actions: TurnAllowedAction[];
};

type TurnAllowedActionBase = {
	id: string;
};

export type TurnAllowedActionPhaseChanger =
	| (TurnAllowedActionBase & {
			action_forces_phase_change: true;
			action_changes_phase_to: TurnPhase;
	  })
	| (TurnAllowedActionBase & {
			action_forces_phase_change: false;
	  });

export type TurnAllowedActionPlaceTroops = TurnAllowedActionPhaseChanger & {
	troops_to_position: number;
	allowed_territories: TerritoryCode[];
};

export type TurnAllowedActionAttack = TurnAllowedActionPhaseChanger & {
	targetable_territories: TerritoryCode[];
};

export type TurnAllowedActionMoveTroops = TurnAllowedActionPhaseChanger & {
	movement: {
		from: TerritoryCode;
		to: TerritoryCode;
		count: number;
	}[];
};

/*
    CLIENT-SIDE
*/

export type TurnAction = TurnActionAttack | TurnActionPlaceTroops | TurnActionMoveTroops;

type TurnActionBase = {
	allowed_action_id: string;
};

export type TurnActionAttack = TurnActionBase & {
	target: TerritoryCode;
	with_troops: {
		from: TerritoryCode;
		count: number;
	}[];
};

export type TurnActionPlaceTroops = TurnActionBase & {
	where: TerritoryCode;
	count: number;
};

export type TurnActionMoveTroops = TurnActionBase & {
	from: TerritoryCode;
	to: TerritoryCode;
	count: number;
};
