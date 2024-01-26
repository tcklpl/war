
export interface ClientToServerPackets {

    requireRoomList: () => void;
    createGameRoom: (name: string) => void;
    joinGameRoom: (name: string) => void;
    leaveGameRoom: () => void;

}