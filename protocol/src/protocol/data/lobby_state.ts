import { GameConfig } from "./game_config";

export interface LobbyState {

    name: string;
    joinable: boolean;

    players: LobbyPlayerState[];

    game_config: GameConfig;

}

export interface LobbyPlayerState {

    name: string;
    is_lobby_owner: boolean;

}