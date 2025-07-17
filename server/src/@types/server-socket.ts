import type { ClientToServerPackets, ServerToClientPackets, SocketData } from ':protocol';
import type { Server, Socket } from 'socket.io';

export type GameSocketServer = Server<ClientToServerPackets, ServerToClientPackets, object, SocketData>;
export type GameSocket = Socket<ClientToServerPackets, ServerToClientPackets, object, SocketData>;
