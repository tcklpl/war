import type { GameParty } from ':protocol';
import { ClientPacket } from '../../../client-packet';

export class ClientPacketSelectParty extends ClientPacket<'selectParty'> {
	constructor(party: GameParty) {
		super('selectParty', party);
	}
}
