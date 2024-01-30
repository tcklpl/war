
export interface ClientToServerPackets {

    requireLobbies: () => void;
    createLobby: (name: string, joinable: boolean) => void;
    joinLobby: (name: string) => void;
    leaveLobby: () => void;

}