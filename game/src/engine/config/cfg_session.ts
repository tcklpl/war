import { ReconnectionInfo } from '../../game/server/connection/reconnection_info';
import { ConfigPage } from './cfg_page';

export class ConfigSession implements ConfigPage {
    page = 'session';

    username = '';
    reconnectionInfo?: ReconnectionInfo;
}
