import { Server, Socket } from 'socket.io';
import { type ClientToServerPackets, type ServerToClientPackets, type SocketData } from '../../../protocol';

export type GameSocketServer = Server<ClientToServerPackets, ServerToClientPackets, object, SocketData>;
export type GameSocket = Socket<ClientToServerPackets, ServerToClientPackets, object, SocketData>;
