import i18next from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { PacketListener } from '../packet-listener';

export class PLGameSaved extends PacketListener {
	register(): void {
		this.socket.on('gGameSaved', () => {
			if (!this.server.currentLobby) return;
			enqueueSnackbar({
				message: i18next.t('ingame:saved'),
				variant: 'default',
			});
		});
	}
}
