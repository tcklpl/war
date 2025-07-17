import type { ReconnectionInfo } from ':game/server/connection/reconnection-info';
import type { ConfigPage } from './cfg-page';

export class ConfigSession implements ConfigPage {
	page = 'session';

	username = '';
	reconnectionInfo?: ReconnectionInfo;
}
