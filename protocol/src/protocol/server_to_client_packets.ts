import { LobbyState, LobbyListState, InitialGameStatePacket } from "./data";

export type LobbyCreationFailReason = "full" | "unavailable name" | "already owner" | "other";

export interface ServerToClientPackets {

    /*
        ----------------------------------------------------------
        Lobby List Packets
        ----------------------------------------------------------
    */
    lobbies: (lobbies: LobbyListState) => void;
    failedToCreateLobby: (reason: LobbyCreationFailReason) => void;
    failedToJoinLobby: () => void;

    /*
        ----------------------------------------------------------
        Lobby Packets
        ----------------------------------------------------------
    */
    joinedLobby: (lobby: LobbyState) => void;
    leftLobby: (kicked?: boolean) => void;
    chatMessage: (sender: string, msg: string) => void;
    updateLobbyState: (lobby: LobbyState) => void;
    lStartingGame: (countdown: number) => void;
    lGameStartCancelled: () => void;

    /*
        ----------------------------------------------------------
        Game Packets
        ----------------------------------------------------------
    */
   gInitialGameState: (state: InitialGameStatePacket) => void;

}