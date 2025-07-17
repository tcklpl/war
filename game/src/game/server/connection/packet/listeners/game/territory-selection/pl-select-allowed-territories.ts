import { PacketListener } from '../../packet-listener';

export class PLGameInitialTerritorySelectionAllowedTerritories extends PacketListener {
	register(): void {
		this.socket.on('gInitialTerritorySelectionAllowedTerritories', territories => {
			if (!this.server.currentLobby) return;
			game.events.dispatchEvent('onTerritorySelectionTurn', territories);
		});
	}
}
