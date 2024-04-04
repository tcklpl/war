import { TerritoryCode } from "../../../../protocol";
import { PlayerWithParty } from "../../@types/utils";
import { ServerPacketInitialTerritorySelectionAllowedTerritories } from "../../socket/packet/game/ini_territory_selection_allowed_territories";
import { ServerPacketInitialTerritoryAssignment } from "../../socket/packet/game/ini_territory_selection_assignment";
import { ServerPacketInitialTerritorySelectionTurn } from "../../socket/packet/game/ini_territory_selection_turn";
import { Game } from "./game";

export class InitialTerritorySelectionManager {

    onSelectionFinished?: () => void;

    private _freeUseTerritoryPool: TerritoryCode[] = [
        "alaska", "california", "cuba", "greenland", "labrador", "mackenzie", "mexico", "new_york", "ottawa", "vancouver", "argentina", "brazil", "chile", "venezuela", "germany", 
        "france", "england", "iceland", "moscow", "sweden", "australia", "sumatra", "borneo", "n_guinea", "egypt", "algeria", "sudan", "congo", "s_africa", "madagascar", "poland", 
        "aral", "india", "ornsk", "middle_east", "vietnam", "china", "mongolia", "dudinka", "tchita", "siberia", "vladvostok", "japan"
    ];

    private _timeoutDurationSeconds = 60;
    private _curPlayerIndex = 0;
    private _curSelectionTimeout?: NodeJS.Timeout;
    private _curAllowedTerritories: TerritoryCode[] = [];

    constructor(private _game: Game) {}

    private removeFromTerritoryPool(code: TerritoryCode) {
        this._freeUseTerritoryPool = this._freeUseTerritoryPool.filter(t => t !== code);
    }

    private setupTerritoryPool() {
        this._game.players.forEach(p => {

            // If the player's party has a fixed starting territory
            if (p.party.startingTerritories !== 'any') {

                // And if it's only ONE possible starting point
                if (p.party.startingTerritories.length === 1) {
                    this.removeFromTerritoryPool(p.party.startingTerritories[0]);
                }

            }
        });
    }

    private selectPlayerTerritory() {
        new ServerPacketInitialTerritorySelectionTurn(this.currentPlayer.username, this._timeoutDurationSeconds).dispatch(...this._game.players);
        
        let availableStarts = this.currentPlayer.party.startingTerritories;
        if (availableStarts === 'any') availableStarts = this._freeUseTerritoryPool;
        this._curAllowedTerritories = availableStarts;
        new ServerPacketInitialTerritorySelectionAllowedTerritories(availableStarts).dispatch(this.currentPlayer);

        this._curSelectionTimeout = setTimeout(() => this.onSelectionTimeout(), this._timeoutDurationSeconds * 1000);
    }

    startPlayerTerritorySelection() {
        this.setupTerritoryPool();
        this.selectPlayerTerritory();
    }

    onTerritorySelection(player: PlayerWithParty, territory: TerritoryCode) {
        if (!this._curAllowedTerritories.find(t => t === territory)) return;
        if (player !== this.currentPlayer) return;

        clearTimeout(this._curSelectionTimeout);
        this._curSelectionTimeout = undefined;

        new ServerPacketInitialTerritoryAssignment(this.currentPlayer.username, territory, 'selected').dispatch(...this._game.players);
        this.finishUpCurrentSelection(territory);
    }

    private onSelectionTimeout() {
        this._curSelectionTimeout = undefined;
        const selected = this._curAllowedTerritories[Math.floor(Math.random() * this._curAllowedTerritories.length)];
        new ServerPacketInitialTerritoryAssignment(this.currentPlayer.username, selected, 'timeout').dispatch(...this._game.players);
        this.finishUpCurrentSelection(selected);
    }

    private finishUpCurrentSelection(selected: TerritoryCode) {
        this.removeFromTerritoryPool(selected);

        // If it's the last player
        if (this._curPlayerIndex === (this._game.players.length - 1)) {
            this.onSelectionFinished?.();
        }
        else {
            this.selectForNextPlayer();
        }

    }

    private selectForNextPlayer() {
        this._curPlayerIndex++;
        this.selectPlayerTerritory();
    }

    private get currentPlayer() {
        return this._game.players[this._curPlayerIndex];
    }

}