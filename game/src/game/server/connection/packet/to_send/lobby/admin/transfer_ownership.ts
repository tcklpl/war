import { ClientPacket } from '../../../client_packet';

export class ClientPacketTransferLobbyOwnership extends ClientPacket<'transferLobbyOwnership'> {
    constructor(newOwner: string) {
        super('transferLobbyOwnership', newOwner);
    }
}
