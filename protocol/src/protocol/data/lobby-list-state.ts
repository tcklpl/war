export interface LobbyListState {
	max_lobbies: number;
	lobbies: LobbyListStateLobby[];
}

export interface LobbyListStateLobby {
	name: string;
	player_count: number;
	owner_name: string;
	joinable: boolean;
}
