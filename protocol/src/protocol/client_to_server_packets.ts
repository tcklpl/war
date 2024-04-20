import { GameParty, LobbyState, TerritoryCode, TurnAction } from "./data";

export interface ClientToServerPackets {

    /*
        ----------------------------------------------------------
        Lobby List Packets
        ----------------------------------------------------------
    */
    requireLobbies: () => void;
    createLobby: (name: string, joinable: boolean) => void;
    joinLobby: (name: string) => void;

    /*
        ----------------------------------------------------------
        Lobby Packets
        ----------------------------------------------------------
    */
    // Common Packets
    leaveLobby: () => void;
    sendChatMessage: (msg: string) => void;

    selectParty: (party: GameParty) => void;
    deselectCurrentParty: () => void;

    // Admin Packets
    transferLobbyOwnership: (to: string) => void;
    modifyLobbyState: (state: LobbyState) => void;
    kickPlayer: (player: string) => void;
    startGame: () => void;
    lCancelGameStart: () => void;
    
    /*
        ----------------------------------------------------------
        Game Packets
        ----------------------------------------------------------
    */
    gPing: (pong: () => void) => void;
    gSelectStartingTerritory: (code: TerritoryCode) => void;
    gGameAction: (action: TurnAction) => void;
}