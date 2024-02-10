import { LobbyState, LobbyListState } from "./data";

export type LobbyCreationFailReason = "full" | "unavailable name" | "already owner" | "other";

export interface ServerToClientPackets {

    lobbies: (lobbies: LobbyListState) => void;
    failedToCreateLobby: (reason: LobbyCreationFailReason) => void;
    failedToJoinLobby: () => void;
    joinedLobby: (lobby: LobbyState) => void;
    updateLobbyState: (lobby: LobbyState) => void;
    leftLobby: (kicked?: boolean) => void;
    chatMessage: (sender: string, msg: string) => void;

}