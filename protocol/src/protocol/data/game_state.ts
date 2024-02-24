import { GameParty } from "./game_party";
import { GraphTerritoryPacket } from "./territory";

export interface InitialGameStatePacket {

    players: GameStatePlayerInfo[];
    territory_graph: GraphTerritoryPacket;
    
}

export interface GameStatePlayerInfo {
    name: string;
    party: GameParty;
    is_lobby_owner: boolean;
    play_order: number;
}