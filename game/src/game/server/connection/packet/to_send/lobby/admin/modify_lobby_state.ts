import { LobbyState } from '../../../../../../../../../protocol';
import { ClientPacket } from '../../../client_packet';

export class ClientPacketModifyLobbyState extends ClientPacket<'modifyLobbyState'> {
    constructor(state: LobbyState) {
        super('modifyLobbyState', state);
    }
}
