import { ReconnectionStatus } from '../../../../../../../../protocol/src/protocol/data/ingame/reconnection_status';
import { ClientPacket } from '../../client_packet';

export class ClientPacketReconnectToGame extends ClientPacket<'gReconnectToGame'> {
    constructor(token: string, callback: (status: ReconnectionStatus) => void) {
        super('gReconnectToGame', token, callback);
    }
}
