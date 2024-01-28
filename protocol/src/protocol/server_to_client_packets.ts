import { PktSvServerLobbies } from "./packets";

export interface ServerToClientPackets {

    lobbies: (lobbies: PktSvServerLobbies) => void;
    

}