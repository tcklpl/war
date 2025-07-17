import type { TerritoryCode } from ':protocol';
import { ServerPacket } from '../server-packet';

export class ServerPacketInitialTerritorySelectionAllowedTerritories extends ServerPacket<'gInitialTerritorySelectionAllowedTerritories'> {
	constructor(allowed: TerritoryCode[]) {
		super('gInitialTerritorySelectionAllowedTerritories', allowed);
	}
}
