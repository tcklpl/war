import { TerritoryCode } from "../../../../protocol";
import { PlayerWithParty } from "../../@types/utils";
import { ServerPacketInitialTerritorySelectionAllowedTerritories } from "../../socket/packet/game/ini_territory_selection_allowed_territories";
import { ServerPacketInitialTerritoryAssignment } from "../../socket/packet/game/ini_territory_selection_assignment";
import { ServerPacketInitialTerritorySelectionTurn } from "../../socket/packet/game/ini_territory_selection_turn";
import svlog from "../../utils/logging_utils";
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
        svlog.debug(`player ${this.currentPlayer.username} is now selecting a starting territory`);
    }

    startPlayerTerritorySelection() {
        svlog.debug(`Starting territory selection, territory pool with size ${this._freeUseTerritoryPool.length}`);
        this.setupTerritoryPool();
        svlog.debug(`Filtered territory pool, new size: ${this._freeUseTerritoryPool.length}`);
        this.selectPlayerTerritory();
    }

    onTerritorySelection(player: PlayerWithParty, territory: TerritoryCode) {
        if (!this._curAllowedTerritories.find(t => t === territory)) {
            svlog.warn(`player ${player} is trying to select a territory that isn't allowed`);
            return;
        }
        if (player !== this.currentPlayer) {
            svlog.warn(`player ${player} is trying to pick a starting territory on another players turn`);
            return;
        }

        clearTimeout(this._curSelectionTimeout);
        this._curSelectionTimeout = undefined;

        svlog.debug(`player ${player} selected the starting territory ${territory}`);
        new ServerPacketInitialTerritoryAssignment(this.currentPlayer.username, territory, 'selected').dispatch(...this._game.players);
        this.finishUpCurrentSelection(territory);
    }

    private onSelectionTimeout() {
        this._curSelectionTimeout = undefined;
        const selected = this._curAllowedTerritories[Math.floor(Math.random() * this._curAllowedTerritories.length)];
        new ServerPacketInitialTerritoryAssignment(this.currentPlayer.username, selected, 'timeout').dispatch(...this._game.players);
        svlog.debug(`player ${this.currentPlayer.username} timed out the territory selection, ${selected} was picked at random`);
        this.finishUpCurrentSelection(selected);
    }

    private finishUpCurrentSelection(selected: TerritoryCode) {
        this.removeFromTerritoryPool(selected);

        // If it's the last player
        if (this._curPlayerIndex >= (this._game.players.length - 1)) {
            svlog.debug(`Territory selection has finished`);
            this.onSelectionFinished?.();
        }
        else {
            svlog.debug(`Selecting territory for next player`);
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