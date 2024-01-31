import { LobbyListState } from "./packets";

export interface ServerToClientPackets {

    lobbies: (lobbies: LobbyListState) => void;
    failedToCreateLobby: (reason: "full" | "unavailable name" | "already owner") => void;
    failedToJoinLobby: () => void;
    joinedLobby: () => void;


}