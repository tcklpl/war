import { GamePauseReason } from ':protocol';

export interface GameEvents {
    onGamePause: (reason: GamePauseReason) => void;
    onGameResume: () => void;

    onTerritorySelectionTurn: () => void;
}
