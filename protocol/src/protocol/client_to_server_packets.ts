
export interface ClientToServerPackets {

    requireLobbies: () => void;
    createLobby: (name: string) => void;
    joinLobby: (name: string) => void;
    leaveLobby: () => void;

}