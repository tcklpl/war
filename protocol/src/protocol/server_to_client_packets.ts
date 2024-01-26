import { PktSvServerRoomList } from "./packets";

export interface ServerToClientPackets {

    roomList: (roomList: PktSvServerRoomList) => void;
    

}