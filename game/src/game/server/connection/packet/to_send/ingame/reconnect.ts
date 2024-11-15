import { ReconnectionStatus } from ':protocol';
import { ClientPacket } from '../../client_packet';

export class ClientPacketReconnectToGame extends ClientPacket<'gReconnectToGame'> {
    constructor(token: string, callback: (status: ReconnectionStatus) => void) {
        super('gReconnectToGame', token, callback);
    }
}
