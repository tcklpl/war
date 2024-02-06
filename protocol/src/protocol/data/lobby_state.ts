
export interface LobbyState {

    name: string;
    joinable: boolean;

    players: LobbyPlayerState[];

}

export interface LobbyPlayerState {

    name: string;
    is_lobby_owner: boolean;

}