import { Socket } from "socket.io-client";
import { ClientToServerPackets, ServerToClientPackets, SocketData } from "../../../protocol";


export type GameSocket = Socket<ServerToClientPackets, ClientToServerPackets>;