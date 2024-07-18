import { enqueueSnackbar } from 'notistack';
import { PacketListener } from '../packet_listener';
import i18next from 'i18next';

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
