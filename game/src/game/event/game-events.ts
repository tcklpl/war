import type { GamePauseReason, TerritoryCode } from ':protocol';

export interface GameEvents {
	onGamePause: (reason: GamePauseReason) => void;
	onGameResume: () => void;

	onTerritorySelectionPlayerChange: (player: string, timeout: number) => void;
	onTerritorySelectionTurn: (allowedTerritories: TerritoryCode[]) => void;
	onTerritorySelectionPlayerAssignment: (
		player: string,
		territory: TerritoryCode,
		reason: 'selected' | 'timeout',
	) => void;
}
