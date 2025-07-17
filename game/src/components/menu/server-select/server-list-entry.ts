import type { ServerConnectionCandidate } from ':game/server/connection/server-connection-candidate';
import type { ServerListSelectInfo } from ':game/server/server-list-select-info';

export interface ServerListEntry {
	info: ServerListSelectInfo;
	connectionCandidate: ServerConnectionCandidate;
}
