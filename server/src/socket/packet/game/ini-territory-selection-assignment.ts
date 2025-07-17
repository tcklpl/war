import type { TerritoryCode } from ':protocol';
import { ServerPacket } from '../server-packet';

export class ServerPacketInitialTerritoryAssignment extends ServerPacket<'gInitialTerritorySelectionAssignment'> {
	constructor(player: string, territory: TerritoryCode, reason: 'selected' | 'timeout') {
		super('gInitialTerritorySelectionAssignment', player, territory, reason);
	}
}
