import { ServerPacket } from '../server_packet';

export class ServerPacketGameSessionConnectionToken extends ServerPacket<'gGameSessionConnectionToken'> {
    constructor(token: string) {
        super('gGameSessionConnectionToken', token);
    }
}
