import type { GameConfig } from './game-config';
import type { GameParty } from './game-party';

export interface LobbyState {
	name: string;
	joinable: boolean;

	players: LobbyPlayerState[];
	selectable_parties: GameParty[];

	game_config: GameConfig;
}

export interface LobbyPlayerState {
	name: string;
	is_lobby_owner: boolean;
	party: GameParty;
}
