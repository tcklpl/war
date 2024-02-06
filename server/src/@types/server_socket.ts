import { Server, Socket } from "socket.io";
import { ClientToServerPackets, ServerToClientPackets, SocketData } from "../../../protocol";


export type GameSocketServer = Server<ClientToServerPackets, ServerToClientPackets, {}, SocketData>;
export type GameSocket = Socket<ClientToServerPackets, ServerToClientPackets, {}, SocketData>;
