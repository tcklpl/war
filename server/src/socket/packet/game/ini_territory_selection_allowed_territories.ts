import { type TerritoryCode } from ':protocol';
import { ServerPacket } from '../server_packet';

export class ServerPacketInitialTerritorySelectionAllowedTerritories extends ServerPacket<'gInitialTerritorySelectionAllowedTerritories'> {
    constructor(allowed: TerritoryCode[]) {
        super('gInitialTerritorySelectionAllowedTerritories', allowed);
    }
}
