import type { WarGame } from ':game/war-game';

declare global {
	var game: WarGame;
}

export default global;
