import { GameConfig } from "./game_config";
import { GameParty } from "./game_party";

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
    party?: GameParty;

}