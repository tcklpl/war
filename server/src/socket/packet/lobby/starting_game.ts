import { ServerPacket } from '../server_packet';

export class ServerPacketStartingGame extends ServerPacket<'lStartingGame'> {
    constructor(seconds: number) {
        super('lStartingGame', seconds);
    }
}
