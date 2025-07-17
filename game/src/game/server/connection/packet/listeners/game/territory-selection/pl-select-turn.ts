import { PacketListener } from '../../packet-listener';

export class PLGameInitialTerritorySelectionTurn extends PacketListener {
	register(): void {
		this.socket.on('gInitialTerritorySelectionTurn', (player, timeout) => {
			if (!this.server.currentLobby) return;
			game.events.dispatchEvent('onTerritorySelectionPlayerChange', player, timeout);
		});
	}
}
