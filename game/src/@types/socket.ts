import { ClientToServerPackets, ServerToClientPackets } from ':protocol';
import { Socket } from 'socket.io-client';

export type GameSocket = Socket<ServerToClientPackets, ClientToServerPackets>;
