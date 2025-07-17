import type { LobbyState } from ':protocol';
import { ClientPacket } from '../../../client-packet';

export class ClientPacketModifyLobbyState extends ClientPacket<'modifyLobbyState'> {
	constructor(state: LobbyState) {
		super('modifyLobbyState', state);
	}
}
