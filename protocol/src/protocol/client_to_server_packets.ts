
export interface ClientToServerPackets {

    requireLobbies: () => void;
    createLobby: (name: string, joinable: boolean) => void;
    joinLobby: (name: string) => void;
    leaveLobby: () => void;
    transferLobbyOwnership: (to: string) => void;
    kickPlayer: (player: string) => void;
    sendChatMessage: (msg: string) => void;

}