import { Socket } from "socket.io-client";
import { ClientToServerPackets, ServerToClientPackets } from "../../../protocol";


export type GameSocket = Socket<ServerToClientPackets, ClientToServerPackets>;