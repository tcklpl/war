import { ServerConnectionCandidate } from ':game/server/connection/server_connection_candidate';
import { ServerListSelectInfo } from ':game/server/server_list_select_info';

export interface ServerListEntry {
    info: ServerListSelectInfo;
    connectionCandidate: ServerConnectionCandidate;
}
