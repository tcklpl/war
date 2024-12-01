import { PacketListener } from '../packet_listener';

export class PLPing extends PacketListener {
    register(): void {
        this._data.socket.on('gPing', pong => {
            pong();
        });
    }
}
