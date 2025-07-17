import type { TurnAllowedActions } from ':protocol';
import { ServerPacket } from '../server-packet';

export class ServerPacketTurnAllowedActions extends ServerPacket<'gTurnAllowedActions'> {
	constructor(pkt: TurnAllowedActions) {
		super('gTurnAllowedActions', pkt);
	}
}
